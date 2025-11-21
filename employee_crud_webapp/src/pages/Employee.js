import React, { useEffect, useState } from 'react'

const Employee = () => {

    const [employee, setEmployee] = useState();

    useEffect(() => {
        fetch("http://localhost:4000/employees", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                setEmployee(data);
            })
            .catch((error) => {
                console.error("Error fetching employee data:", error);
            });
    }, []);
  return (
    <>
        <h1>Employee</h1>

        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Department</th>
                    <th>Salary</th>
                </tr>
            </thead>
            <tbody>
                {employee && employee.map((emp) => (
                    <tr key={emp._id}>
                        <td>{emp._id}</td>
                        <td>{emp.name}</td>
                        <td>{emp.email}</td>
                        <td>{emp.role}</td>
                        <td>{emp.department}</td>
                        <td>{emp.salary}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </>
  )
}

export default Employee
