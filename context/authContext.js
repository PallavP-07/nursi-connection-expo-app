import AsyncStorage from "@react-native-async-storage/async-storage";
import {  createContext, useEffect, useState } from "react";


export const AuthContext = createContext();

export const  AuthProvider =({children})=>{
    const[authToken,setAuthToken]=useState(null);
    const[loading,setLoading]=useState(true);

    useEffect(()=>{
        const loadToken = async ()=>{
            const token = await AsyncStorage.getItem("auth_token");
            setAuthToken(token);
            setLoading(false);
        };
        loadToken();
    },[]);

    const generateToken = async(token)=>{
        await AsyncStorage.setItem("auth_token",token);
        setAuthToken(token);
    }

    const removeToken = async ()=>{
        await AsyncStorage.removeItem("auth_token");
        setAuthToken(null);
    };

    return(
        <AuthContext.Provider value ={{removeToken,generateToken,authToken,loading}}>
            {children}
        </AuthContext.Provider>
    )
}
