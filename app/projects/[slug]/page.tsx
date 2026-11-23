import {notFound} from 'next/navigation';
import {projects} from '../../../lib/projects';
import CasePage from '../../../components/case-page';
export function generateStaticParams(){return projects.map(p=>({slug:p.slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const p=projects.find(p=>p.slug===slug);return {title:p?`${p.title} — Руслан Мелкумян`:'Проект не найден'};}
export default async function Case({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const index=projects.findIndex(p=>p.slug===slug);if(index<0)notFound();return <CasePage index={index}/>;}
