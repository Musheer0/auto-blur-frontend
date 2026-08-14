export const sendEmail = async(data:{
    email:string,
    subject:string,
    content:string
})=>{
    try {
        await fetch(process.env.AUTOFLOW_SEND_EMAIL_URL!, {
        method:"POST",
        headers:{
            "x-webhook-secret":process.env.AUTOFLOW_SEND_EMAIL_WH!
        },
        body:JSON.stringify(data)
    })
    } catch (error) {
      console.error(error,"AUTOFLOW SEND EMAIL ERROR")

    }
}

export const sendSuccessEmail = async (email: string, id: string) => {
  await sendEmail({
    email,
    subject: "Your video was blurred successfully",
    content: `
Your video has been successfully blurred and is ready to download.

Download your video here:
${process.env.APP}/history/${id}

Thank you for using Blurfield!
    `.trim(),
  });
};
export const sendFailureEmail = async (email: string) => {
  await sendEmail({
    email,
    subject: "We couldn't generate your video",
    content: `
Unfortunately, we couldn't generate your video.

You can try again by starting a new generation here:
${process.env.APP}/generate

Sorry for the inconvenience. Please try again.
    `.trim(),
  });
};