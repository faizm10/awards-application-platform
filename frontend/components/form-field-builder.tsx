"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Plus, Trash2, GripVertical } from "lucide-react"
import type { AwardFormField } from "@/lib/admin"

interface FormFieldBuilderProps {
  fields: AwardFormField[]
  onChange: (fields: AwardFormField[]) => void
}

export function FormFieldBuilder({ fields, onChange }: FormFieldBuilderProps) {
  const [editingField, setEditingField] = useState<AwardFormField | null>(null)

  const addField = () => {
    const newField: AwardFormField = {
      id: `field-${Date.now()}`,
      type: "text",
      label: "New Field",
      required: false,
    }
    setEditingField(newField)
  }

  const saveField = (field: AwardFormField) => {
    const existingIndex = fields.findIndex((f) => f.id === field.id)
    if (existingIndex >= 0) {
      const updatedFields = [...fields]
      updatedFields[existingIndex] = field
      onChange(updatedFields)
    } else {
      onChange([...fields, field])
    }
    setEditingField(null)
  }

  const deleteField = (fieldId: string) => {
    onChange(fields.filter((f) => f.id !== fieldId))
  }

  const moveField = (fromIndex: number, toIndex: number) => {
    const updatedFields = [...fields]
    const [movedField] = updatedFields.splice(fromIndex, 1)
    updatedFields.splice(toIndex, 0, movedField)
    onChange(updatedFields)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Application Form Fields</h3>
        <Button onClick={addField} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Field
        </Button>
      </div>

      {/* Existing Fields */}
      <div className="space-y-3">
        {fields.map((field, index) => (
          <Card key={field.id}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{field.label}</span>
                    <Badge variant="outline" className="text-xs">
                      {field.type}
                    </Badge>
                    {field.required && (
                      <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">
                        Required
                      </Badge>
                    )}
                  </div>
                  {field.placeholder && (
                    <div className="text-sm text-muted-foreground">Placeholder: {field.placeholder}</div>
                  )}
                  {field.options && (
                    <div className="text-sm text-muted-foreground">Options: {field.options.join(", ")}</div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setEditingField(field)}>
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => deleteField(field.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Field Editor Modal/Form */}
      {editingField && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle className="text-lg">
              {fields.find((f) => f.id === editingField.id) ? "Edit Field" : "Add New Field"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FieldEditor field={editingField} onSave={saveField} onCancel={() => setEditingField(null)} />
          </CardContent>
        </Card>
      )}
    </div>
  )
}

interface FieldEditorProps {
  field: AwardFormField
  onSave: (field: AwardFormField) => void
  onCancel: () => void
}

function FieldEditor({ field, onSave, onCancel }: FieldEditorProps) {
  const [editedField, setEditedField] = useState<AwardFormField>(field)

  const handleSave = () => {
    if (!editedField.label.trim()) return
    onSave(editedField)
  }

  const updateField = (updates: Partial<AwardFormField>) => {
    setEditedField((prev) => ({ ...prev, ...updates }))
  }

  const addOption = () => {
    const options = editedField.options || []
    updateField({ options: [...options, ""] })
  }

  const updateOption = (index: number, value: string) => {
    const options = [...(editedField.options || [])]
    options[index] = value
    updateField({ options })
  }

  const removeOption = (index: number) => {
    const options = [...(editedField.options || [])]
    options.splice(index, 1)
    updateField({ options })
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="field-label">Field Label *</Label>
          <Input
            id="field-label"
            value={editedField.label}
            onChange={(e) => updateField({ label: e.target.value })}
            placeholder="Enter field label"
          />
        </div>
        <div>
          <Label htmlFor="field-type">Field Type</Label>
          <Select
            value={editedField.type}
            onValueChange={(value) => updateField({ type: value as AwardFormField["type"] })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text">Text Input</SelectItem>
              <SelectItem value="textarea">Text Area</SelectItem>
              <SelectItem value="number">Number</SelectItem>
              <SelectItem value="select">Dropdown</SelectItem>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="file">File Upload</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="field-placeholder">Placeholder Text</Label>
        <Input
          id="field-placeholder"
          value={editedField.placeholder || ""}
          onChange={(e) => updateField({ placeholder: e.target.value })}
          placeholder="Enter placeholder text"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="field-required"
          checked={editedField.required}
          onCheckedChange={(checked) => updateField({ required: checked })}
        />
        <Label htmlFor="field-required">Required field</Label>
      </div>

      {/* Options for select fields */}
      {editedField.type === "select" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Options</Label>
            <Button type="button" variant="outline" size="sm" onClick={addOption}>
              <Plus className="h-4 w-4 mr-2" />
              Add Option
            </Button>
          </div>
          <div className="space-y-2">
            {(editedField.options || []).map((option, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={option}
                  onChange={(e) => updateOption(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                />
                <Button type="button" variant="ghost" size="sm" onClick={() => removeOption(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Validation for number fields */}
      {editedField.type === "number" && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="field-min">Minimum Value</Label>
            <Input
              id="field-min"
              type="number"
              value={editedField.validation?.min || ""}
              onChange={(e) =>
                updateField({
                  validation: {
                    ...editedField.validation,
                    min: e.target.value ? Number(e.target.value) : undefined,
                  },
                })
              }
            />
          </div>
          <div>
            <Label htmlFor="field-max">Maximum Value</Label>
            <Input
              id="field-max"
              type="number"
              value={editedField.validation?.max || ""}
              onChange={(e) =>
                updateField({
                  validation: {
                    ...editedField.validation,
                    max: e.target.value ? Number(e.target.value) : undefined,
                  },
                })
              }
            />
          </div>
        </div>
      )}

      <div className="flex gap-3 pt-4">
        <Button onClick={handleSave} disabled={!editedField.label.trim()}>
          Save Field
        </Button>
        <Button variant="outline" onClick={onCancel} className="bg-transparent">
          Cancel
        </Button>
      </div>
    </div>
  )
}
