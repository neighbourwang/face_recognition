
function fsubmit() {
    const src = "http://zbin429.koreasouth.cloudapp.azure.com:8080/face-detect";
    const temp = `<div class="loadEffect">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>`
    const data = new FormData();
    data.append('userName', $('#name').val());
    data.append('conf', $('#yuzhi').val());
    data.append('videoFace', $("#recognize")[0].files[0]);
    data.append('userFace', $("#compare")[0].files[0]);
    $.ajax({
        url: 'http://zbin429.koreasouth.cloudapp.azure.com:8080/face-detect/api/face/recog',
        type: 'POST',
        data: data,
        dataType: 'JSON',
        cache: false,
        processData: false,
        contentType: false,
        // timeout:10000,
        beforeSend: function (XMLHttpRequest) {
            //alert('远程调用开始...'); 
            $("#loading").show().html(temp);
        },
        success: function (data, textStatus) {
            console.log(data);
            if (data && data.status == 'ok') {
                if (data.data.left.face_rectangle) {
                    let conf = data.data;
                    $('#upload').hide();
                    $('#success').show();
                    $('#image')[0].src = src + conf.left.path;
                    // $('#image').attr({'min-height':''});               
                    $('#image')[0].onload = function () {
                        let obj = Object.assign({}, resetScale(data.data.left.face_rectangle), { userName: conf.userName }, { path: conf.left.path })
                        console.log(obj)
                        appeChild(obj);
                    }
                } else {
                    alert('未匹配到目标，请调整阈值或选择新的图片')
                }
            } else {
                alert('服务器异常');
            }
            $("#loading").hide();
        },
        error: function () {
            $("#loading").hide();
            alert('failed');
        }
    })
    return false;
}
// const obj = { "width": 102, "top": 425, "left": 723, "height": 102 };

function appeChild(obj) {
    console.log(obj.width);
    let p = `<p style="position:absolute;left:${obj.left}px;top:${obj.top - 25}px;z-index:20;color:red;font-size:18px;">${obj.userName}</p>`
    let div = `<div style="position:absolute;width:${obj.width}px;height:${obj.height}px;left:${obj.left}px;top:${obj.top}px;border:2px solid red;z-index:10"></div>`
    $('#result').append(p);
    $('#result').append(div);
}
var drawPolygon = function () {
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    var img = new Image()
    img.src = './assets/images/150.jpg';
    let [w, h] = originScale(img);
    $('#myCanvas').height($('.container-fluid').width() * h / w);
    console.log($('#myCanvas')[0].clientWidth);
    let percent = $('#myCanvas')[0].clientWidth / w;
    console.log(percent, '比例2');

    let conf = { "width": 102, "top": 425, "left": 723, "height": 102 }
    let x = conf.left * percent;
    console.log(x, 'left2');
    let y = conf.top * percent;
    let width = conf.width * percent;
    console.log(width);
    let height = conf.height * percent;
    // let w=resetScale(scal)
    // var x = conf && conf.left.face_rectangle.left *x|| 0;  //中心点x坐标
    // var y = conf && conf.left.face_rectangle.top *x|| 0;  //中心点y坐标
    // var width = conf && conf.left.face_rectangle.width*x || 0;
    // var height = conf && conf.left.face_rectangle.height*x||0;
    var border = conf && conf.border || 2;
    var strokeStyle = (conf && conf.strokeStyle) || '#FF0000';
    // var fillStyle = conf && conf.fillStyle;
    // var path = conf && conf.left.path;
    // let font = conf && conf.font || 'serif';
    // let fontSize = conf && conf.fontSize || 48;
    let text = conf && conf.userName || 'yaoyao';
    // img.src = src + path;
    // console.log(img.src);
    img.onload = function () //确保图片已经加载完毕  
    {
        // resetScale(obj);        
        ctx.drawImage(img, 0, 0, $('#myCanvas')[0].width, $('#myCanvas')[0].height);
        ctx.lineWidth = border;
        ctx.strokeStyle = strokeStyle;
        ctx.strokeRect(x, y, 30, 30);//矩形
        ctx.fillStyle = 'green';
        // ctx.font = fontSize + 'px ' + font;
        ctx.fillText(text, x, y - 10);//写字
        // alert('比对成功')
    }
    //开始路径
    //路径闭合
    // if (strokeStyle) {
    //     ctx.strokeStyle = strokeStyle;
    //     ctx.lineWidth = width;
    //     ctx.lineJoin = 'round';
    //     ctx.stroke();
    // }
    // if (fillStyle) {
    //     ctx.fillStyle = fillStyle;
    //     // ctx.fill();
    // }
}
function originScale(image) {
    let imgW, imgH;
    if (image.naturalWidth) {
        imgW = image.naturalWidth;
        imgH = image.naturalHeight;

    } else {
        let img = new Image();
        img.src = image.src;
        imgW = img.width;
        imgH = img.height;
    }
    return [imgW, imgH];
}
function resetScale(obj) {
    let [w, h] = originScale($('#image')[0]);
    console.log(w, h)
    let x = $('#image').width() / w;
    console.log(x, '比例');
    console.log(obj.left * x, 'left');
    return {
        width: obj.width * x,
        top: obj.top * x + parseInt($('#result').css('padding-top')),
        left: obj.left * x + parseInt($('#result').css('padding-left')),
        height: obj.height * x
    }
}
window.onload = function () {
    $('#success').hide();
    $("#loading").hide();
    $('#submit').bind('click', () => {
        fsubmit();
    })
    $('#back').bind('click', () => {
        $('#image')[0].src = '';
        $('#result').html(`<img class="img-responsive" id="image" 　class="image" alt="">`);
        $('#success').hide();
        $('#upload').show();
    })

}