# Application Submission System

This document explains how the application submission system works in the awards platform.

## Overview

The application submission system allows students to:
1. Fill out application forms with various field types (text, textarea, file uploads)
2. Save applications as drafts
3. Submit completed applications for review
4. Upload documents that are stored in Supabase Storage
5. Handle essay responses with word limits

## Database Schema

### Applications Table

```sql
CREATE TABLE applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  award_id uuid NOT NULL REFERENCES awards(id),
  student_id uuid NOT NULL REFERENCES profiles(id),
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'under_review', 'approved', 'rejected', 'reviewed')),
  
  -- Form fields
  first_name text,
  last_name text,
  student_id_text text,
  major_program text,
  credits_completed text,
  email text,
  
  -- Document URLs
  resume_url text,
  letter_url text,
  community_letter_url text,
  international_intent_url text,
  certificate_url text,
  
  -- Text responses
  response_text text,
  travel_description text,
  travel_benefit text,
  budget text,
  
  -- Essay responses (JSON)
  essay_responses jsonb DEFAULT '{}',
  
  submitted_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);
```

### Award Required Fields Table

```sql
CREATE TABLE award_required_fields (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  award_id uuid NOT NULL REFERENCES awards(id),
  field_name text NOT NULL,
  label text NOT NULL,
  type text NOT NULL CHECK (type IN ('file', 'text', 'textarea')),
  required boolean DEFAULT false,
  question text,
  field_config jsonb, -- For essay questions, word limits, etc.
  created_at timestamp with time zone DEFAULT now()
);
```

## File Upload System

### Storage Buckets

The system uses Supabase Storage with the following bucket structure:

```
applications/
├── {award_id}/
│   └── {student_id}/
│       ├── resume/
│       ├── letter/
│       ├── community_letter/
│       └── other_documents/
```

### File Upload Component

The `FileUpload` component handles:
- Drag and drop file uploads
- File type validation
- File size limits
- Progress tracking
- Error handling
- Multiple file support

```tsx
<FileUpload
  label="Upload Resume"
  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
  maxSize={10} // 10MB
  required={true}
  onUpload={(url) => setResumeUrl(url)}
  onError={(error) => console.error(error)}
  bucketName="applications"
  filePath={`${awardId}/${userId}/resume`}
  disabled={isSubmitting}
/>
```

## Application Submission Flow

### 1. Form Data Collection

The system collects three types of data:

```typescript
interface FormData {
  // Regular form fields
  first_name: string;
  last_name: string;
  // ... other fields
}

interface Documents {
  // Document URLs from file uploads
  resume: string; // URL to uploaded file
  letter: string;
  // ... other documents
}

interface EssayResponses {
  // Essay responses with field IDs as keys
  "essay_response_123": string;
  "essay_response_456": string;
}
```

### 2. Data Transformation

The `transformFormDataToApplication` function converts form data to database format:

```typescript
const applicationData = transformFormDataToApplication(
  formData,
  documents,
  essayResponses
);

// Result:
{
  first_name: "John",
  last_name: "Doe",
  resume_url: "https://storage.supabase.co/...",
  letter_url: "https://storage.supabase.co/...",
  essay_responses: {
    "essay_response_123": "My essay content...",
    "essay_response_456": "Another essay..."
  }
}
```

### 3. Database Operations

#### Save Draft
```typescript
const result = await saveApplicationDraft(
  awardId,
  studentId,
  applicationData,
  existingApplicationId // Optional, for updates
);
```

#### Submit Application
```typescript
const result = await submitApplication(
  applicationId,
  applicationData
);
```

## Usage Examples

### Basic Application Form

```tsx
import { FileUpload } from "@/components/file-upload";
import { 
  saveApplicationDraft, 
  submitApplication,
  transformFormDataToApplication 
} from "@/lib/applications";

function ApplicationForm({ awardId, userId }) {
  const [formData, setFormData] = useState({});
  const [documents, setDocuments] = useState({});
  const [essayResponses, setEssayResponses] = useState({});

  const handleSaveDraft = async () => {
    const applicationData = transformFormDataToApplication(
      formData,
      documents,
      essayResponses
    );

    const result = await saveApplicationDraft(
      awardId,
      userId,
      applicationData
    );

    if (result) {
      toast("Draft saved successfully!");
    }
  };

  const handleSubmit = async () => {
    const applicationData = transformFormDataToApplication(
      formData,
      documents,
      essayResponses
    );

    const result = await submitApplication(
      applicationId,
      applicationData
    );

    if (result) {
      toast("Application submitted successfully!");
      router.push("/my-applications");
    }
  };

  return (
    <form>
      {/* Text fields */}
      <Input
        value={formData.first_name || ""}
        onChange={(e) => setFormData(prev => ({
          ...prev,
          first_name: e.target.value
        }))}
      />

      {/* File upload */}
      <FileUpload
        label="Upload Resume"
        onUpload={(url) => setDocuments(prev => ({
          ...prev,
          resume: url
        }))}
        currentFile={documents.resume}
        required={true}
        bucketName="applications"
        filePath={`${awardId}/${userId}/resume`}
      />

      {/* Essay field */}
      <Textarea
        value={essayResponses["essay_response_123"] || ""}
        onChange={(e) => setEssayResponses(prev => ({
          ...prev,
          "essay_response_123": e.target.value
        }))}
      />

      <Button onClick={handleSaveDraft}>Save Draft</Button>
      <Button onClick={handleSubmit}>Submit Application</Button>
    </form>
  );
}
```

### Loading Existing Application

```tsx
import { getApplicationByAwardAndStudent, extractFormDataFromApplication } from "@/lib/applications";

function ApplicationForm({ awardId, userId }) {
  const [existingApplication, setExistingApplication] = useState(null);
  const [formData, setFormData] = useState({});
  const [documents, setDocuments] = useState({});
  const [essayResponses, setEssayResponses] = useState({});

  useEffect(() => {
    const loadApplication = async () => {
      const app = await getApplicationByAwardAndStudent(awardId, userId);
      if (app) {
        setExistingApplication(app);
        
        const { formData: extractedFormData, documents: extractedDocuments, essayResponses: extractedEssayResponses } = extractFormDataFromApplication(app);
        
        setFormData(extractedFormData);
        setDocuments(extractedDocuments);
        setEssayResponses(extractedEssayResponses);
      }
    };

    loadApplication();
  }, [awardId, userId]);

  // ... rest of component
}
```

## Field Name Mapping

The system automatically maps field names to database columns:

| Form Field Name | Database Column | Description |
|----------------|----------------|-------------|
| `resume` | `resume_url` | Resume document |
| `letter` | `letter_url` | Reference letter |
| `community_letter` | `community_letter_url` | Community service letter |
| `international_intent` | `international_intent_url` | International intent document |
| `certificate` | `certificate_url` | Certificate document |
| `first_name` | `first_name` | Student's first name |
| `last_name` | `last_name` | Student's last name |
| `student_id_text` | `student_id_text` | Student ID number |
| `major_program` | `major_program` | Student's major/program |
| `email` | `email` | Student's email |

## Error Handling

The system provides comprehensive error handling:

1. **File Upload Errors**: Network issues, file size limits, unsupported types
2. **Database Errors**: Connection issues, constraint violations
3. **Validation Errors**: Missing required fields, invalid data
4. **Authentication Errors**: User not logged in, insufficient permissions

## Security Considerations

1. **File Upload Security**:
   - File type validation
   - File size limits
   - Secure file naming with timestamps and random IDs
   - Row-level security policies in Supabase

2. **Data Validation**:
   - Server-side validation of all form data
   - SQL injection prevention through parameterized queries
   - XSS prevention through proper escaping

3. **Access Control**:
   - Users can only access their own applications
   - Admin/reviewer roles for application management
   - Secure file access through signed URLs

## Testing

To test the application submission system:

1. **Create a test award** with required fields
2. **Upload test files** to verify storage functionality
3. **Submit test applications** to verify database operations
4. **Test validation** with invalid data
5. **Test error scenarios** like network failures

## Troubleshooting

### Common Issues

1. **File upload fails**: Check Supabase Storage bucket configuration and RLS policies
2. **Application not saving**: Verify database connection and table permissions
3. **Form validation errors**: Check required field configuration in award_required_fields table
4. **Essay responses not saving**: Ensure essay_responses column is JSONB type

### Debug Steps

1. Check browser console for JavaScript errors
2. Verify Supabase client configuration
3. Check network tab for failed requests
4. Review Supabase logs for server-side errors
5. Validate database schema matches expected structure
