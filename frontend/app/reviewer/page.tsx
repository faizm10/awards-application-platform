'use client'
import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'

const Reviewer = () => {
  const [user, setUser] = useState<any>(null)
  const [applications, setApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserAndApplications = async () => {
      const supabase = createClient()
      const { data: userData } = await supabase.auth.getUser()
      setUser(userData.user)
      if (userData.user) {
        // Fetch applications assigned to this reviewer (or all if not assigned)
        const { data, error } = await supabase
          .from('applications')
          .select('*')
          .order('created_at', { ascending: false })
        if (!error && data) {
          setApplications(data)
        }
      }
      setLoading(false)
    }
    fetchUserAndApplications()
  }, [])

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Card>
          <CardContent className="p-6">
            <CardTitle className="mb-2 text-2xl font-bold">Reviewer Dashboard</CardTitle>
            <p className="text-muted-foreground mb-2">
              Welcome{user ? `, ${user.email}` : ''}! Here you can review and rate student applications.
            </p>
            <div className="mt-4">
              <span className="font-semibold">Total Applications:</span> {applications.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <CardTitle className="mb-4 text-xl font-semibold">Applications</CardTitle>
            {loading ? (
              <div>Loading applications...</div>
            ) : applications.length === 0 ? (
              <div className="text-muted-foreground">No applications to review yet.</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map(app => (
                    <TableRow key={app.id}>
                      <TableCell>{app.first_name} {app.last_name}</TableCell>
                      <TableCell>{app.status}</TableCell>
                      <TableCell>{app.submitted_at ? new Date(app.submitted_at).toLocaleDateString() : '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Reviewer