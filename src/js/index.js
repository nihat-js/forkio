function toggleMobileNav(){
    let list  = documtn.querySelector(".nav-mobile__list")
    if (list.style.display == "flex"){
        list.style.display = "none"
    }else {
        list.style.display = "flex"
    }

}