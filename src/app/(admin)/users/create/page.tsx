"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";


export default function CreateUserPage() {


  const router = useRouter();


  const [roles,setRoles] = useState<any[]>([]);

  const [loading,setLoading] = useState(false);


  const [form,setForm] = useState({

    name:"",
    email:"",
    phone:"",
    password:"",
    roleId:""

  });



  useEffect(()=>{


    async function getRoles(){

      try{


        const res = await fetch(
          "/api/admin/roles"
        );


        const data = await res.json();


        setRoles(
          data.roles || []
        );


      }
      catch(error){

        console.log(error);

      }


    }


    getRoles();


  },[]);




  function handleChange(
    e:React.ChangeEvent<
      HTMLInputElement |
      HTMLSelectElement
    >
  ){


    setForm({

      ...form,

      [e.target.name]:
      e.target.value

    });


  }






  async function createUser(){



    if(!form.roleId){

      alert(
        "Please select role"
      );

      return;

    }



    setLoading(true);



    try{


      const res = await fetch(

        "/api/admin/users/create",

        {

          method:"POST",

          headers:{

            "Content-Type":
            "application/json"

          },


          body:JSON.stringify({

            name:
            form.name,


            email:
            form.email,


            phone:
            form.phone,


            password:
            form.password,


            roleId:
            form.roleId


          })

        }


      );



      const data =
      await res.json();




      if(data.success){


        alert(
          "User created successfully"
        );


        router.push("/users");


      }
      else{


        alert(
          data.message ||
          "User creation failed"
        );


      }




    }
    catch(error){


      console.log(error);


      alert(
        "Something went wrong"
      );


    }
    finally{


      setLoading(false);


    }



  }






  return (

<div style={styles.container}>


<div style={styles.card}>


<h1 style={styles.title}>
Create New User
</h1>



<p style={styles.subtitle}>
Assign role and permissions
</p>





<div style={styles.form}>


<input

name="name"

placeholder="Full Name"

value={form.name}

onChange={handleChange}

style={styles.input}

/>





<input

name="email"

placeholder="Email"

value={form.email}

onChange={handleChange}

style={styles.input}

/>






<input

name="phone"

placeholder="Phone"

value={form.phone}

onChange={handleChange}

style={styles.input}

/>






<input

name="password"

placeholder="Password"

type="password"

value={form.password}

onChange={handleChange}

style={styles.input}

/>








<select

name="roleId"

value={form.roleId}

onChange={handleChange}

style={styles.input}

>


<option value="">
Select Role
</option>



{

roles.map((role)=>(


<option

key={role._id}

value={role._id}

>

{role.name}

</option>



))


}



</select>






<button

onClick={createUser}

disabled={loading}

style={styles.button}

>


{

loading

?

"Creating..."

:

"Create User"


}



</button>



<button

onClick={()=>
router.push("/users")
}

style={styles.cancel}

>

Cancel

</button>






</div>



</div>



</div>


  );


}






const styles:any = {


container:{


minHeight:"100vh",

background:"#f1f5f9",

display:"flex",

justifyContent:"center",

alignItems:"center",

padding:"30px"


},



card:{


width:"450px",

background:"#fff",

padding:"35px",

borderRadius:"15px",

boxShadow:
"0 10px 30px rgba(0,0,0,0.1)"


},



title:{


fontSize:"28px",

fontWeight:"700",

color:"#0f172a",

marginBottom:"5px"


},



subtitle:{


color:"#64748b",

marginBottom:"25px"


},




form:{


display:"flex",

flexDirection:"column",

gap:"15px"


},




input:{


padding:"13px",

borderRadius:"10px",

border:
"1px solid #cbd5e1",

fontSize:"15px",

outline:"none",

color:"#111827",

background:"#fff"


},




button:{


padding:"13px",

background:"#2563eb",

color:"#fff",

border:"none",

borderRadius:"10px",

fontSize:"16px",

cursor:"pointer"


},



cancel:{


padding:"13px",

background:"#e2e8f0",

color:"#334155",

border:"none",

borderRadius:"10px",

cursor:"pointer"


}



};