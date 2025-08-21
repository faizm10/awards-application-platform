import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import puppeteer from "puppeteer";

export async function POST(request: NextRequest) {
  try {
    const { applicationId } = await request.json();
    
    if (!applicationId) {
      return NextResponse.json({ error: "Application ID is required" }, { status: 400 });
    }

    const supabase = await createClient();

    // Fetch application with all related data
    const { data: application, error: appError } = await supabase
      .from("applications")
      .select(`
        *,
        student:profiles(*),
        award:awards(*)
      `)
      .eq("id", applicationId)
      .single();

    if (appError || !application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    // Fetch required fields for the award
    const { data: requiredFields, error: fieldsError } = await supabase
      .from("award_required_fields")
      .select("*")
      .eq("award_id", application.award.id)
      .order("created_at", { ascending: true });

    if (fieldsError) {
      console.error("Error fetching required fields:", fieldsError);
    }

    // Generate HTML content for the PDF
    const htmlContent = generateApplicationHTML(application, requiredFields || []);

    // Generate PDF using Puppeteer
    const browser = await puppeteer.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      margin: {
        top: '20mm',
        right: '20mm',
        bottom: '20mm',
        left: '20mm'
      },
      printBackground: true
    });

    await browser.close();

    // Return PDF as response
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="application-${application.award?.code}-${application.student?.full_name}.pdf"`
      }
    });

  } catch (error) {
    console.error("Error generating PDF:", error);
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 });
  }
}

function generateApplicationHTML(application: any, requiredFields: any[]) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Application - ${application.award?.title}</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          text-align: center;
          border-bottom: 3px solid #2563eb;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .header h1 {
          color: #2563eb;
          margin: 0;
          font-size: 28px;
        }
        .header p {
          margin: 5px 0;
          color: #666;
        }
        .section {
          margin-bottom: 30px;
          page-break-inside: avoid;
        }
        .section h2 {
          color: #2563eb;
          border-bottom: 2px solid #e5e7eb;
          padding-bottom: 10px;
          margin-bottom: 20px;
          font-size: 20px;
        }
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }
        .info-item {
          background: #f9fafb;
          padding: 15px;
          border-radius: 8px;
          border-left: 4px solid #2563eb;
        }
        .info-item strong {
          display: block;
          color: #374151;
          margin-bottom: 5px;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .info-item span {
          color: #111827;
          font-size: 16px;
        }
        .essay-section {
          margin-bottom: 20px;
        }
        .essay-question {
          font-weight: bold;
          color: #111827;
          margin-bottom: 8px;
          font-size: 16px;
        }
        .essay-answer {
          color: #374151;
          white-space: pre-wrap;
          font-size: 14px;
          line-height: 1.6;
          margin-bottom: 16px;
        }
        .status-badge {
          display: inline-block;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .status-submitted {
          background: #dcfce7;
          color: #166534;
        }
        .status-draft {
          background: #fef3c7;
          color: #92400e;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          text-align: center;
          color: #6b7280;
          font-size: 12px;
        }
        @media print {
          body { margin: 0; }
          .section { page-break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${application.award?.title}</h1>
        <p><strong>Application ID:</strong> ${application.id}</p>
        <p><strong>Generated on:</strong> ${formatDate(new Date().toISOString())}</p>
      </div>

      <div class="section">
        <h2>Student Information</h2>
        <div class="info-grid">
          <div class="info-item">
            <strong>Full Name</strong>
            <span>${application.first_name} ${application.last_name}</span>
          </div>
          <div class="info-item">
            <strong>Email Address</strong>
            <span>${application.email}</span>
          </div>
          <div class="info-item">
            <strong>Student ID</strong>
            <span>${application.student_id_text}</span>
          </div>
          <div class="info-item">
            <strong>Major/Program</strong>
            <span>${application.major_program}</span>
          </div>
        </div>
      </div>

      <div class="section">
        <h2>Award Details</h2>
        <div class="info-grid">
          <div class="info-item">
            <strong>Award Title</strong>
            <span>${application.award?.title}</span>
          </div>
          <div class="info-item">
            <strong>Award Code</strong>
            <span>${application.award?.code}</span>
          </div>
          <div class="info-item">
            <strong>Value</strong>
            <span>${application.award?.value}</span>
          </div>
          <div class="info-item">
            <strong>Category</strong>
            <span>${application.award?.category}</span>
          </div>
          <div class="info-item">
            <strong>Donor</strong>
            <span>${application.award?.donor}</span>
          </div>
          <div class="info-item">
            <strong>Deadline</strong>
            <span>${application.award?.deadline ? formatDate(application.award.deadline) : 'Not specified'}</span>
          </div>
        </div>
      </div>

      <div class="section">
        <h2>Application Status</h2>
        <div class="info-grid">
          <div class="info-item">
            <strong>Status</strong>
            <span class="status-badge status-${application.status}">${application.status}</span>
          </div>
          <div class="info-item">
            <strong>Submitted Date</strong>
            <span>${application.submitted_at ? formatDate(application.submitted_at) : 'Not submitted'}</span>
          </div>
          <div class="info-item">
            <strong>Last Updated</strong>
            <span>${application.updated_at ? formatDate(application.updated_at) : 'Not available'}</span>
          </div>
        </div>
      </div>

      ${(() => {
        const fieldsWithAnswers = requiredFields.filter((field: any) => {
          const fieldKey = `essay_response_${field.id}`;
          const response = application.essay_responses?.[fieldKey] || '';
          return response.trim() !== '';
        });

        if (fieldsWithAnswers.length === 0) return '';

        return `
          <div class="section">
            <h2>Essay Responses</h2>
            ${fieldsWithAnswers.map((field: any) => {
              const fieldKey = `essay_response_${field.id}`;
              const response = application.essay_responses?.[fieldKey] || '';
              const question = field.field_config?.question || field.label;
              return `
                <div class="essay-section">
                  <div class="essay-question">
                    <strong>${question}</strong>
                  </div>
                  <div class="essay-answer">
                    ${response}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        `;
      })()}

      <div class="footer">
        <p>This document was automatically generated from the awards application system.</p>
        <p>Application ID: ${application.id} | Generated: ${formatDate(new Date().toISOString())}</p>
      </div>
    </body>
    </html>
  `;
}
