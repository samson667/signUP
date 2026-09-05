let page=document.querySelector(".page")



export function showToast(message,success) {

    

    const toast = document.createElement("div");


    if(!success){
        toast.classList.add("colors")    
    }else{
        toast.classList.remove("colors")    

    }
    toast.classList.add("toast");
    toast.innerText = message;

    page.appendChild(toast);



    // Show
    setTimeout(() => {
        toast.classList.add("show");
    }, 10);

    // Hide
    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);

    // Remove
    setTimeout(() => {
        toast.remove();
    }, 3300);
}