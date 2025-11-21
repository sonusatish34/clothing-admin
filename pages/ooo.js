// // // App.jsx
// // import React from "react";
// // import { useQuery } from "@tanstack/react-query";

// // // 1️⃣ Function to fetch data from API
// // const fetchUsers = async () => {
// //   const response = await fetch("https://jsonplaceholder.typicode.com/users");
// //   if (!response.ok) throw new Error("Network response was not ok");
// //   return response.json(); // return parsed JSON data
// // };

// // // 2️⃣ Component
// // export default function App() {
// //   // 3️⃣ useQuery hook
// //   const { data, isLoading, isError, error } = useQuery({
// //     queryKey: ["users"],      // unique key to cache this data
// //     queryFn: fetchUsers,      // function that fetches data
// //   });

// //   // 4️⃣ Handle states
// //   if (isLoading) return <p>Loading...</p>;
// //   if (isError) return <p>Error: {error.message}</p>;

// //   // 5️⃣ Render fetched data
// //   return (
// //     <div>
// //       <h2>Users List</h2>
// //       <ul>
// //         {data?.map((user) => (
// //           <li key={user.id}>{user.name}</li>
// //         ))}
// //       </ul>
// //     </div>
// //   );
// // }

// // import React from 'react';
// // const ComponentName = (props) => {

// // Reverse a number in javascript
// // const str = 'longdrivecars'
// // let strrev=str.split('').reverse().join('');
// // console.log(strrev,'rev');

// // function Palindrom(str)
// // {
// //   const rev = str.split('').reverse().join('')
// //   if(rev == str)
// //     return 'yes'
// //   else
// //     return 'no'
// // }
// // console.log(Palindrom('abba'));

// //remove duplicate from a string
// // const stri = 'satish'
// // let res= ''
// // let setres = [...new Set(stri)].join('')
// // console.log(setres,'00000000');

// // for (let char of stri)
// // {
// //   if(!res.includes(char))
// //   {
// //     res = res + char;
// //   }
// // }
// // for (let i = 0; i < stri.length - 1; i++) {
// //   if(!res.includes(stri[i]))
// //   {
// //     res+= stri[i]
// //   }
// // }
// // console.log(res,'rsitl');

// //find first non repeating character 
// // frequency map
// //   const str = 'abcdc'
// //   const freq={}
// //   function fnonrchar(strx)
// //   {
// //     for(let char of strx)
// //     {
// //       freq[char] = ( freq[char] | 0) + 1
// //     }
// //     for (let char of strx)
// //     {
// //       if(freq[char] ===1)
// //       {
// //         return char
// //       }
// //     }
// //     return null
// //   }
// //   console.log(fnonrchar('aambbcc'));
// //   console.log(freq);


// //   return (
// //     <div>0.
// //       <p>mkmkmk</p>
// //     </div>
// //   );
// // };

// // export default ComponentName;
// // import React, { useState } from "react";

// // function WithoutUseMemo() {
// //   const [count, setCount] = useState(0);
// //   const [filter, setFilter] = useState("");

// //   const numbers = Array.from({ length: 10000 }, (_, i) => i + 1);

// //   // ❌ This filtering happens on EVERY render
// //   const filtered = numbers.filter((num) => {
// //     console.log('into fultweubg');

// //     for (let i = 0; i < 100000; i++) {} // simulate heavy task
// //     return num % 2 === 0 && num.toString().includes(filter);
// //   });

// //   return (
// //     <div>
// //       <h2>Without useMemo</h2>
// //       <p>Count: {count}</p>
// //       <button onClick={() => setCount(count + 1)}>Increment</button>
// //       <br />
// //       <input
// //         type="text"
// //         placeholder="Filter even numbers..."
// //         value={filter}
// //         onChange={(e) => setFilter(e.target.value)}
// //       />
// //       <p>Showing {filtered.length} numbers</p>
// //     </div>
// //   );
// // }

// // export default WithoutUseMemo;
// // import { useRef, useEffect, useReducer } from "react";
// // function reducer(state, action) {
// //     switch (action.type) {
// //       case 'increment':
// //         return { count: state.count + 1 };
// //       case 'decrement':
// //         return { count: state.count - 1 };
// //       default:
// //         return state;
// //     }
// //   }
// // function Timer() {
// //   const [state, reducer] = useReducer(reducer, { count: 0 })
  
// //   const countRef = useRef(0);
  
// //   const handleClick = () => {
// //     countRef.current += 1;
// //     console.log("Clicked", countRef.current);
// //   };

// //   return <button onClick={() => dispatch({ type: 'increment' })}>+</button>
// // ;
// // }

// // export default function InputFocus() {
// //   const inputRef = useRef(null);

// //   useEffect(() => {
// //     inputRef.current.focus(); // Access the DOM node
// //   }, []);

// //   // ✅ Correct return syntax
// //   return (
// //     <div>
// //       <input ref={inputRef} placeholder="Focuses on mount" />
// //       <Timer />
// //     </div>
// //   );
// // }

// // import { useReducer } from "react";
// // import { useQuery } from "@tanstack/react-query";
// // function reducer(state, action) {
// //   switch (action.type) {
// //     case "increment":
// //       return { count: state.count + 1 };
// //     case "decrement":
// //       return { count: state.count - 1 };
// //     case "reset":
// //       return { count: 0 };
// //     default:
// //       return state;
// //   }
// // }

// // export default function Counter() {
// //   const {data,isError,isLoading} = useQuery({
// //     queryKey:['users'],
// //     queryFn: ()=>fetch('/api/users').then(res=>res.json()),
// //   })
// //   const [state, dispatch] = useReducer(reducer, { count: 0 });

// //   return (
// //     <div>
// //       <h2>Count: {state.count}</h2>
// //       <button onClick={() => dispatch({ type: "decrement" })}>-</button>
// //       <button onClick={() => dispatch({ type: "increment" })}>+</button>
// //       <button onClick={() => dispatch({ type: "reset" })}>Reset</button>
// //     </div>
// //   );
// // }

// "use client"
// import Image from "next/image";
// import { useState, useEffect } from "react";

// export default function Home() {



//   const [addItem, setAdditem] = useState('werth')
//   const [data, setData] = useState(null);

//   useEffect(() => {
//     fetch("/api/hello")
//       .then(res => console.log(res))
//       .then(data => setData(data));
//   }, []);
//   const handleCLick = async()=>
//   {
//     let data = {
//       name:'satish',
//       age:'25'
//     }
//     let a = await fetch('/api/add',{
//       method:'post',headers:{
//         'Content-type':'application/json',
//         body:JSON.stringify(data)
//       }
//     }
//   )
//   let res= await a.json()
//   console.log(res,'kkkk')

//   }
//   return (
//     <div>
//       {/* <input readOnly className="border" type="text" value={addItem} />
//       <button className="border rounded-md bg-green-700 px-2">Add</button>
//       <p>Tasks</p>
//       <ul>
//         <li>{data?.message}</li>
//       </ul> */}
//       <h1>NEtx js api demo </h1>
//         <button onClick={handleCLick}>button click</button>
//     </div>
//   );
// }

// components/HeroSection.jsx
export default function HeroSection() {
  return (
    <div className="relative w-full h-screen bg-gray-900 text-white overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/9782010.jpg')" ,backgroundSize:'50%',backgroundRepeat:'repeat'}}
      ></div>

      {/* <div className="absolute inset-0 bg-black/10"></div> */}

      <div className="relative z-10 flex flex-col justify-center  items-center h-full text-black border bg-white/20 w-full">
        <h1 className="text-5xl font-bold">Welcome to My Site</h1>
        <p className="mt-4 text-lg">Your content goes here</p>
      </div>
    </div>
  );
}
