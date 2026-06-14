'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import styles from './page.module.css'

export default function Home() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchStudents() {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        setError(error.message)
      } else {
        setStudents(data)
      }
      setLoading(false)
    }

    fetchStudents()
  }, [])

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Student List</h1>
        <p>Data coming live from your Supabase backend</p>
      </header>

      <main className={styles.main}>
        {loading && (
          <p className={styles.message}>Loading students...</p>
        )}

        {error && (
          <div className={styles.errorBox}>
            <p className={styles.errorTitle}>Could not connect to Supabase</p>
            <p className={styles.errorHint}>
              Make sure you created your <code>.env.local</code> file with your project URL and anon key.
            </p>
            <code className={styles.errorDetail}>{error}</code>
          </div>
        )}

        {!loading && !error && students.length === 0 && (
          <p className={styles.message}>
            No students found. Did you run the SQL and add some rows in your Supabase dashboard?
          </p>
        )}

        {!loading && !error && students.length > 0 && (
          <table className={styles.table}>
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th>Email</th>
                <th>Course</th>
                <th>Grade</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td className={styles.avatarCell}>
                    <img
                      className={styles.avatar}
                      src={student.picture_url}
                      alt={student.name}
                    />
                  </td>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td>{student.course}</td>
                  <td>{student.grade}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  )
}
