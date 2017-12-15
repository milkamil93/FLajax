var FLajax = {
    error: '<span style="color:#ff7581;">Заполните необходимые поля</span>',
    sending: 'Идёт отправка',
    pageurl: 'Страница с запросом',
    referrer: 'Источник трафика',
    sent: 'Сообщение отправлено',
    yaMetrik: function(m){
        yaCounter47027148.reachGoal(m); // Меняем номер метрики на свои "yaCounterНОМЕР МЕТРИКИ.reachGoal(m);"
    },
    status: '.FLresult',
    typesfield: '[type=text],[type=hidden],[type=tel],[type=email],[type=number],[type=date],[type=email],[type=range],[type=datetime],[type=url],[type=month],[type=week],[type=time],[type=datetime-local],textarea',
    opt: {
        required: []
    }
};

$(document).ready(function () {
    $(document).delegate('.FLajax', 'click', function(e) {
        e.preventDefault();
        FLsend($(this));
    });

    if(!getData('FLreferrer') && (document.referrer)) { // Источник трафика
        localStorage.setItem('FLreferrer', document.referrer);
    }
});
 
function FLstatus(form, c, t) { // Статус отправки
    var result = form.find(FLajax.status);
    if (c && t){
        result.html('<div class='+c+'>'+t+'</div>');			
    } else if (!c && !t) {
        result.html('');
    }
}

function FLsend(e) { // Функция отправки
    var err = false, 
    allRequired = true,
    form = $(e).closest('form');

    form.find(FLajax.typesfield).each(function() {
        var th = $(this);
        if(th.attr('required') !== undefined) {
            FLajax.opt.required.push(th.attr('name'));
            allRequired = false;
            if(th.val().length < 1) {
                $(this).addClass('has-error');
                err = true;
                form.find(FLajax.status).html(FLajax.error);
            } else {
                th.removeClass('has-error');
            }
        }
    });

    if(allRequired) {
        form.find(FLajax.typesfield).each(function(k) {
            var th = $(this);
            FLajax.opt.required.push(th.attr('name'));
            if (th.val().length < 1){
                err = true;
                th.addClass('has-error');
                form.find(FLajax.status).html(FLajax.error);
            } else {
                th.removeClass('has-error');
            }
        });
    }

    if(err) { 
        if(form.hasClass('cme')){
            FLstatus(form, 'error', FLajax.error);
        }
        return false; 
    }

    FLstatus(form, 'sending', FLajax.sending);
    
    var formData = new FormData(form[0]);

    var rf = getData('FLreferrer'); // Источник трафика
    if (rf && rf.length > 0) {
        formData.append(FLajax.referrer, rf);
    }

    formData.append(FLajax.pageurl, location.href); // Страница с запросом
    
    var FLyaM = e.attr('data-FL-yaM');
    
    FLajax.opt.to = e.attr('data-FL-to');
    FLajax.opt.theme = e.attr('data-FL-theme');
    
    formData.append('opt', JSON.stringify(FLajax.opt));
    
    $.ajax({
        url: '/assets/snippets/FLajax/FLajax.php',
        type: 'post',
        dataType: 'json',
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        success: function(json) {
            var items = form.find(FLajax.typesfield);
            items.removeClass('has-error');
            if(json['status'] === false) {
                if(json['errors'].length !== 0) {
                    $.each(json['errors'], function (key) {
                        items.filter('[name="' + key + '"]').addClass('has-error');
                    });
                    FLstatus(form, 'error', FLajax.error);
                } else {
                    FLstatus(form, 'error', json['messages']);
                }
            } else {
                FLstatus(form, 'sent', FLajax.sent);
                e.attr('disabled', 'disabled');
                setTimeout(function(){
                    if(typeof($.fancybox) !== 'undefined'){
                        $.fancybox.close();
                    }
                }, 2000);
                if (FLyaM !== undefined) FLajax.yaMetrik(FLyaM);
            }
        },
        error: function (status) {
            console.log(status);
        }
    });
}

function getData(e) {
    return localStorage.getItem(e) || false;
}