import { createContext } from "react";

export const ContextData = createContext({
  bookkings:[],
  setBooks:()=>{},
  type:'',
  setType:()=>{},
  flights:[],
  setFlights:()=>{},
  user:'',
  setUser:()=>{},
  userId:'',
  setUserId:()=>{}
})