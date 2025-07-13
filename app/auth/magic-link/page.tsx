import React, {Suspense} from 'react'
import {redirect } from 'next/navigation'
import {transporter} from '@/lib/email'
import { createVerificationToken } from '@/lib/auth'
import StatusBanner from '@/components/StatusBanner'

function Login() {



    async function sendMagicLink(formData: FormData){
        'use server'
        const email = (formData.get('email') as string ).trim().toLowerCase()
        if(!email || !email.includes('@')){
            redirect('/auth/magic-link?status=error')
        }

        try {
            //generate and presist token 
            const token = await createVerificationToken(email)

            //build url 

            const baseUrl = process.env.NEXT_PUBLIC_SITE_URL!
            const magicUrl= `${baseUrl}/verify?token=${token}`

            //send vai nodemailer

            await transporter.sendMail({
                to:email,
                from:`QuickRock Technologies`,
                subject: 'Your Secure Magic Link',
                html: `
                        <p>Hello! Click the button below to sign in.</p>
                        <p><a href="${magicUrl}"
                                style="display:inline-block;padding:12px 24px;
                                    background:#16a34a;color:#fff;border-radius:6px;
                                    text-decoration:none;font-weight:600">
                                Sign in
                            </a></p>
                        <p>This link will expire in 15 minutes and can be used only once.</p>
                     `,
            })
            

        } catch (error) {
            const err= error as Error
            console.error('[magic-link-error]', err)
            return redirect('/auth/magic-link?status=error')
        }
        redirect('/auth/magic-link?status=success')
        
    }

  return (
    <div className='w-full h-screen bg-gray-50 flex items-center justify-center '>
            <form 
            action={sendMagicLink}
            className='bg-gray-800  w-70  md:w-100  rounded-md flex flex-col items-start justify-center px-3 py-5 md:p-5 gap-5 shadow-2xl shadow-gray-900'
            >
                <label htmlFor=""
                className=''
                >Enter Your Email Address</label>
                <input type="email" 
                name='email'
                 className='border-2 rounded-md w-full h-12 px-2 py-1 outline-none focus:border-green-500'
                 />
                 <button
                 type='submit'
                 className='bg-green-600 rounded-md h-12 w-full hover:bg-green-700 hover:scale-105 cursor-pointer duration-300'
                 >
                 Send Magic Link
                 </button>
                 <Suspense fallback={<p>Loading...</p>}>
                    <StatusBanner/>
                 </Suspense>

            </form>

    </div>
  )
}

export default Login