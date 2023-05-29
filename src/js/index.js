function toggleMobileNav(){
    let list  = document.querySelector(".nav-mobile__list")
    let btn = document.querySelector(".nav-mobile__hamburger")
    if (list.style.display == "block"){
        list.style.display = "none"
        btn.src="./src/img/hamburger.svg"

    }else {
        list.style.display = "block"
        btn.src="./src/img/close-2.svg"

    }

}