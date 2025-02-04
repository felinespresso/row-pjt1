'use client'; 
import { useRouter } from "next/navigation"; 
import { MouseEventHandler, useRef, ReactNode, useEffect } from "react"; 
 
export default function Modal({ children }: { children: ReactNode }) { 
    const overlay = useRef(null); 
    const router = useRouter(); 
 
    useEffect(() => { 
        document.body.classList.add('overflow-hidden'); 
        return () => { 
            document.body.classList.remove('overflow-hidden'); 
        }; 
    }, []); 
 
    const close: MouseEventHandler = (e) => { 
        if (e.target === overlay.current) { 
            router.back(); 
        } 
    }; 
 
    return ( 
        <div  
            ref={overlay} 
            className="fixed inset-0 z-10 flex items-center justify-center bg-black/50 animate-fadeIn" 
            onClick={close}> 
            <div className="p-6 bg-white rounded-lg w-96 ring-2 ring-gray-600 ring-opacity-5 animate-popIn shadow-box"> 
                {children} 
            </div> 
        </div> 
    ); 
}