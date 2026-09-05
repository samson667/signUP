export function otp_generte () {
  let otp=[]

  for (let i = 0; i <= 5; i++) {
    otp.push( Math.floor(Math.random() * 10))
  }

  return otp.join('')
}
