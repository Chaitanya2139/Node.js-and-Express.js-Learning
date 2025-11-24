import React, { useEffect, useState } from 'react'

const Employee = ({ refreshKey }) => {
    const [employee, setEmployee] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch("/api/employees");
                if (!res.ok) throw new Error(`Server responded ${res.status}`);
                const data = await res.json();
                setEmployee(data || []);
            } catch (err) {
                console.error("Error fetching employee data:", err);
                setError(err.message);
                setEmployee([]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div>
            <h1>Employee</h1>
            {loading && <p>Loading...</p>}
            {error && <p style={{color: 'red'}}>Error: {error}</p>}
            {!loading && !error && (
                <ul>
                    {employee.length === 0 ? (
                        <li>No employees found.</li>
                    ) : (
                        employee.map(emp => (
                            <li key={emp._id}>{emp.name} — {emp.email} — {emp.role} — {emp.department} — ${emp.salary}</li>
                        ))
                    )}
                </ul>
            )}
        </div>
    )
}

export default Employee
                    