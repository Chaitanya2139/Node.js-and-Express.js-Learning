import React ,{useState}from 'react'
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

export default function AddEmployee(){
  const navigate = useNavigate();
    const [name,setName]=useState("");
    const [email,setEmail]=useState("");
    const [department,setDepartment]=useState("");
    const [role,setRole]=useState("");
    const [salary,setSalary]=useState("");

    async function handleSubmit(){
      try {
        // convert salary to a number before sending
        const payload = {
          name: name,
          email: email,
          role: role,
          department: department,
          salary: Number(salary)
        };

        const res = await fetch('/api/employees',{
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        const data = await res.json().catch(() => null);

        if (!res.ok) {
          console.error('Server responded with error:', res.status, data);
          Swal.fire({
            title: 'Error',
            text: (data && (data.error || data.message)) || `Server returned ${res.status}`,
            icon: 'error'
          });
          return;
        }

        console.log('Created:', data);
        setDepartment("");
        setEmail("");
        setName("");
        setRole("");
        setSalary("");

        Swal.fire({ title: 'Added Successfully!', icon: 'success', draggable: true });
        // notify parent so list can refresh
        // navigate to employees list so the table becomes visible
        navigate('/employees');
      } catch (err) {
        console.error('Network or fetch error:', err);
        Swal.fire({ title: 'Network error', text: err.message, icon: 'error' });
      }
    }
    return (
        <>
        <h1>Add employees </h1>
        Enter name : <input type="text" placeholder='enter name' value={name} onChange={(e)=>{setName(e.target.value)}}/> <br /> <br />
        Enter Email: <input type="text" placeholder='enter Email' value={email} onChange={(e)=>{setEmail(e.target.value)}}/> <br /> <br />
        Enter department  : <input type="text" placeholder='enter department' value={department} onChange={(e)=>{setDepartment(e.target.value)}}/> <br /> <br />
        Enter role  : <input type="text" placeholder='enter role' value={role} onChange={(e)=>{setRole(e.target.value)}}/> <br /> <br />
        Enter salary  : <input type="text" placeholder='enter salary' value={salary} onChange={(e)=>{setSalary(e.target.value)}}/> <br /> <br />
        <button onClick={()=>{handleSubmit()}}>Add button</button>
        </>
    )
}