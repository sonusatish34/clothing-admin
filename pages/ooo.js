
// // const newarr = new Array(1,34,65,656554)
// // console.log(newarr)
// // newarr.pop()
// // console.log(newarr)

// // let a = [11,43,256,43,434];
// // a.splice(1)
// // console.log(a.splice(1,2));
// // console.log(a);
// // Creating an Array and Initializing with Values
// let a = ["HTML", "CSS", "JS", "React"];
// let b = ["Node.js", "Expess.js"];

// // Concatenate both arrays
// let concateArray = [...b, ...a].reverse()

// console.log("Concatenated Array: ", concateArray.toString());
// // Example 1
// const a1 = [5]
// // console.log(a1)

// // Example 2
// // const a2 = new Array(61)
// // console.log(a2.length)
// // console.log(a1);
// const printal = ['1', '32', '32121', '134', '8872']
// // console.log(printal[0]);
// const newar = []
// for (let i = 0; i <= printal.length; i++) {
//   if (i % 2 == 0)
//     // console.log(printal[i]);
//     newar.push(printal[i])
// }
// // console.log(newar, 'newae');
// function search(arr, x) {
//   const n = arr.length;
//   for (let i = 0; i < n; i++)
//     if (arr[i] == x)
//       return i;
//   return -1;
// }

// let arr = [2, 4, 10, 4];
// let x = 4;

// let result = search(arr, x);
// (result == -1)
//   ? console.log("Element is not present in array")
//   : console.log("Element is present at index " + result);

// // largest elemnet
// // const uniqueArr = [...new Set(arr)].sort((a, b) => b - a);

// function secondlatgest(arr) {
//   const uniqueArr = [...new Set(arr)].sort((a, b) => b - a);
//   // let a = Math.max(...arr)
//   // uniqueArr.unshift();
//   return uniqueArr[1]
// }
// // console.log(secondlatgest([32, 32, 32, 32, 5, 5, 4, 4]));
// const arr2= [1,3,5,6,9]
// console.log(arr2.shift(22,8989));
// console.log(arr2);
import React from 'react';

const ComponentName = (props) => {
  return (
    <div>
      
    </div>
  );
};

export default ComponentName;