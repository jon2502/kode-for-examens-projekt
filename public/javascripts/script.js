
var img = document.querySelectorAll('.fileimg')
var delete_btn = document.getElementById('delete_user_button')
var file_delete_btn = document.querySelectorAll('.deletefile')
const radioindput = document.querySelectorAll('input[type="radio"]')
const dlt_comment_btn = document.querySelectorAll('.dlt_comment_btn')
const log_btn = document.querySelectorAll('.log_btn');

// img modal
function imgfuntion(){
    if (img.length > 0){
        img.forEach(single_img => {
        single_img.addEventListener("click", modal)
    });
    }else{
        return
    }

}
imgfuntion()

function modal(){
    let overlay = document.createElement('div');
    overlay.classList.add('overlay');
    document.body.prepend(overlay);

    let closeBtn = document.createElement('button');
    closeBtn.innerText = "X";
    overlay.append(closeBtn);
    closeBtn.addEventListener('click', (e) => {
        e.target.parentNode.parentNode.removeChild(e.target.parentNode);
    })

    let imgcontainer = document.createElement('div')
    imgcontainer.classList.add('imgcontainer');
    overlay.append(imgcontainer)

    let imgscale = document.createElement('img');
    imgscale.classList.add('largeimg');
    imgscale.src = this.src
    imgcontainer.append(imgscale)
}
if(delete_btn){
    delete_btn.addEventListener("click",deletefunktion)
        function deletefunktion(){
            let sesction = document.getElementById('are_you_sure')
            let formcontainer = document.createElement('div')
            formcontainer.innerHTML = `
            <p>are you sure you want to delete your account if you do all content on the page linked to your account will be deleted<p>
            <form action="/delete" method="post">
            <button type="submit" class="button_link main_text">Yes delete user</button>
            </form>
            `
            sesction.append(formcontainer)
    }
}
if(file_delete_btn){
    file_delete_btn.forEach(btn => {
        btn.addEventListener("click", function(){
            let formcontainer = document.createElement('div')
            formcontainer.innerHTML = `
            <p>er du sikker på at du vil slette denne fil hvis du gør vil den slettes permanent<p>
            <form action="/info/deletefile" method="post">
                <input type="text" hidden="hidden" name="public_id" value="${this.id}">
            <button type="submit" class="button_link main_text">Yes delete file</button>
            </form>
            `
            btn.after(formcontainer)
        })
    });
}

if(dlt_comment_btn){
    dlt_comment_btn.forEach(btn => {
        btn.addEventListener("click", function(){
            let formcontainer = document.createElement('div')
            formcontainer.innerHTML = `
            <p>are you sure<p>
            <form action="/info/deletecomment/${this.id}" method="post">
            <input type="text" hidden="hidden" name="forslagid" value="${btn.classList[3]}">
            <button type="submit" class="button_link main_text">Yes delete comment</button>
            </form>
            `
            btn.after(formcontainer)
        })
    });
}

if(radioindput){
    radioindput.forEach(radiobtn => {
        radiobtn.addEventListener("change",function(){
            var container = document.getElementById('example')
            if(container.firstElementChild){
                container.removeChild(container.firstElementChild);
            }
            if(radioindput[0].checked == true && radioindput[2].checked == true){
                let html = document.createElement('div')
                html.classList.add('listinfo_type1')
                html.innerHTML =`
                <p>title</p>
                <p>username</p>
                <p>email</p>
                <p>kategori</p>
                <p>dateadded</p>
                <p>likes</p>
                <p>dislike</p>
                <p>more info</p>
                `
                container.appendChild(html)
            }
            if(radioindput[0].checked == true && radioindput[3].checked == true){
                let html = document.createElement('div')
                html.classList.add('listinfo_type2')
                html.innerHTML =`
                <p>title</p>
                <p>username</p>
                <p>email</p>
                <p>kategori</p>
                <p>dateadded</p>
                <p>score</p>
                <p>more info</p>
                `
                container.appendChild(html)
            }
            if(radioindput[1].checked == true && radioindput[2].checked == true){
                let html = document.createElement('div')
                html.classList.add('listinfo_type1')
                html.innerHTML =`
                <p>title</p>
                <p>username</p>
                <p>email</p>
                <p>kategori</p>
                <p>dateadded</p>
                <p class="green">likes</p>
                <p class="red">dislike</p>
                <p>more info</p>
                `
                container.appendChild(html)
            }
            if(radioindput[1].checked == true && radioindput[3].checked == true){
                let html = document.createElement('div')
                html.classList.add('listinfo_type2')
                html.innerHTML =`
                <p>title</p>
                <p>username</p>
                <p>email</p>
                <p>kategori</p>
                <p>dateadded</p>
                <p class="green">score</p>
                <p>more info</p>
                `
                container.appendChild(html)
            }
        })
    })
}
if(log_btn){
    log_btn.forEach(btn => {
        btn.addEventListener("click",function(){
            if(btn.classList.contains("open")){
                console.log('happen')
                btn.classList.remove("open")
                btn.innerHTML = "display logs"
                var parrent = btn.parentElement
                parrent.children[1].classList.add("hiddenlogs")
            }else{
                btn.classList.add("open");
                btn.innerHTML = "close"
                var parrent = btn.parentElement
                parrent.children[1].classList.remove("hiddenlogs")
            }
        })
    })
}


