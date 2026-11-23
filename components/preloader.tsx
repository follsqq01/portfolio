'use client';
import {useEffect,useState} from 'react';
export function Preloader(){const [visible,setVisible]=useState(true);useEffect(()=>{if(sessionStorage.getItem('project-transition')==='1'){sessionStorage.removeItem('project-transition');setVisible(false);return}const timer=window.setTimeout(()=>setVisible(false),420);return()=>window.clearTimeout(timer)},[]);if(!visible)return null;return <div className="preloader" aria-hidden="true"><span>RM</span></div>}
