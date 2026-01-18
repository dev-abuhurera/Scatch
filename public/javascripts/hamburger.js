const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

console.log('Hamburger:', hamburger);
console.log('NavMenu:', navMenu);

if(hamburger && navMenu){

    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        
        console.log('Hamburger clicked!');
        console.log('Before:', navMenu.className);

        // toggle opacity
        navMenu.classList.toggle('opacity-0');
        navMenu.classList.toggle('opacity-100');

        // toggle position
        navMenu.classList.toggle('top-[-400px]');
        navMenu.classList.toggle('top-[20px]');
        
        console.log('After:', navMenu.className);
    });

    document.addEventListener('click', (e) => {
        if(!hamburger.contains(e.target) && !navMenu.contains(e.target)){
            navMenu.classList.add('opacity-0');
            navMenu.classList.remove('opacity-100');
            navMenu.classList.add('top-[-400px]');
            navMenu.classList.remove('top-[20px]');
        }
    });

} else {
    console.log('Elements not found!');
}