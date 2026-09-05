import {showToast} from './toster.js'
document.addEventListener('DOMContentLoaded', () => {
    const emailInput = document.getElementById('email');
    const sendOtpBtn = document.getElementById('sendOtpBtn');
    const otpField = document.getElementById('otpField');
    const otpBoxes = Array.from(document.querySelectorAll('.otp-box'));
    const otpTimer = document.getElementById('otpTimer');
    const otpHint = document.getElementById('otpHint');
    const form = document.getElementById('signupForm');
    const verifyOtpBtn = document.getElementById('verifyOtpBtn');
    const submitBtn = document.getElementById('submitBtn');
  

    let timerInterval = null;
    let otpVerified = false;

    function isValidEmail(value) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    function startTimer(seconds) {
      clearInterval(timerInterval);
      let remaining = seconds;
      otpTimer.classList.remove('ready');
      otpTimer.textContent = `Resend in 0:${String(remaining).padStart(2, '0')}`;

      timerInterval = setInterval(() => {
        remaining -= 1;
        if (remaining <= 0) {
          clearInterval(timerInterval);
          otpTimer.textContent = 'Resend code';
          otpTimer.classList.add('ready');
        } else {
          const s = String(remaining % 60).padStart(2, '0');
          const m = Math.floor(remaining / 60);
          otpTimer.textContent = `Resend in ${m}:${s}`;
        }
      }, 1000);
    }

    sendOtpBtn.addEventListener('click', () => {

      const email = emailInput.value.trim();

      if (!isValidEmail(email)) {
        emailInput.focus();
        emailInput.parentElement.style.borderColor = '';
        emailInput.style.borderColor = 'var(--danger)';
        emailInput.placeholder = 'Enter a valid email first';
        return;
      }
      emailInput.style.borderColor = '';



      // simulate sending an OTP
      otpSend()
       verifyOtpBtn.classList.toggle("hide")
      otpBoxes[0].focus();
      sendOtpBtn.disabled = true;
      sendOtpBtn.textContent = 'Sending…';
      otpTimer.classList.toggle("hide")
      startTimer(120);
      
      setTimeout(() => {
        sendOtpBtn.textContent = 'Resend';
        sendOtpBtn.disabled = false;
        otpField.hidden = false;
        otpHint.textContent = `We sent a code to ${email}.`;
        otpHint.className = 'otp-hint';
      }, 120000);



    });

    otpTimer.addEventListener('click', () => {
      if (otpTimer.classList.contains('ready')) {
        sendOtpBtn.click();
      }
    });

    otpBoxes.forEach((box, i) => {
      box.addEventListener('input', () => {
        box.value = box.value.replace(/[^0-9]/g, '').slice(0, 1);
        if (box.value && i < otpBoxes.length - 1) {
          otpBoxes[i + 1].focus();
        }
        
      });

      box.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !box.value && i > 0) {
          otpBoxes[i - 1].focus();
        }
      });

      box.addEventListener('paste', (e) => {
        e.preventDefault();
        const digits = (e.clipboardData.getData('text') || '').replace(/[^0-9]/g, '').split('');
        digits.forEach((d, idx) => {
          if (otpBoxes[idx]) otpBoxes[idx].value = d;
        });
        const nextEmpty = otpBoxes.find(b => !b.value);
        (nextEmpty || otpBoxes[otpBoxes.length - 1]).focus();
        // checkOtpComplete();
      });
    });

    function checkOtpComplete(message,success) {
      console.log("aije dekho---",message)
      const code = otpBoxes.map(b => b.value).join('');
      if (success) {
        // simulate verification — replace with a real API call
        otpVerified = true;
        otpHint.textContent = message;
        otpHint.className = 'otp-hint success';
        otpHint.style.removeProperty('color');

      } else {
        otpVerified = false;
        otpHint.textContent =message;
        otpHint.style.color = 'red';
        
      }
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('name').value.trim();
      const age = document.getElementById('age').value;

      if (!name || !age || !isValidEmail(emailInput.value.trim())) {
        alert('Please fill in your name, age and a valid email.');
        return;
      }

      if (otpField.hidden || !otpVerified) {
        otpHint.textContent = 'Please verify the code sent to your email first.';
        otpHint.className = 'otp-hint error';
        otpField.hidden = false;
        otpBoxes[0].focus();
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Creating account…';

      setTimeout(() => {
        submitBtn.textContent = 'Account created ✓';
      }, 900);
    });

    
  async function otpSend() {
      let result = await fetch('/sendOtp', {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify({
              email: emailInput.value
          })
      })

      console.log(await result.text())
  }
    
    
   async function verify() {

    const userOtp = otpBoxes
        .map(box => box.value)
        .join('')

    let result = await fetch('/verify', {
        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            email: emailInput.value,
            userOtp: userOtp
        })
    })

    let message = await result.text()

    console.log("Server:", message)

    if (message !== "verified") {
        otpVerified = false
        // alert("Not verified")
        showToast("OTP IS WORNG",false)
        checkOtpComplete("OTP IS WORNG",false)
        return
      }
      
      otpVerified = true
      showToast("verified successFull",true)
      checkOtpComplete("verified successFull",true)




               if(otpVerified===true){
               verifyOtpBtn.disabled = true;
               verifyOtpBtn.classList.add("hide")
               otpTimer.classList.add("hide")
               sendOtpBtn.classList.add("hide")
               
               
               otpBoxes.forEach((oneBox)=>{
                 oneBox.disabled=true;
                 oneBox.classList.add("verified")
                })
               }


}





    verifyOtpBtn.addEventListener('click',()=>{
      verify()
    })
  });



  // xjvu avrp gfpo kthq
  // sendmail-ff



