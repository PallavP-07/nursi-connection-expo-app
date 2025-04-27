import { create } from "zustand";
import api from "../api/client";
import  {API_ENDPOINTS} from '../api/endPoints';
const useNurseStore = create((set)=>({

    nurseData:[],
    loading:false,
    error:null,
    selectedNurseData:null,

fetchNurseData: async ()=>{
    set({loading:true});
    try{
        const response = await api.post(API_ENDPOINTS.NURSE_DETAILS)
    }catch(error){
     set({error:error.message,loading:false});
    }
}
}))