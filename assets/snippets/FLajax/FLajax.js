/**
 ***
 *** Minify by https://github.com/milkamil93
 ***
 **/
var FLajax = {
    error: 'Заполните необходимые поля',
    fatal_error: 'Неизвестная ошибка',
    sending: 'Идёт отправка',
    pageurl: 'Страница с запросом',
    referrer: 'Источник трафика',
    sent: 'Сообщение отправлено',
    yaMetrik: function(m){
        // Меняем номер метрики на свои "yaCounterНОМЕР МЕТРИКИ.reachGoal(m);"
        yaCounter47027148.reachGoal(m);
    },
    status: '.FLresult',
    typesfield: '[type=file],[type=checkbox],[type=radio],[type=text],[type=hidden],[type=tel],[type=email],[type=number],[type=date],[type=range],[type=datetime],[type=url],[type=month],[type=week],[type=time],[type=datetime-local],textarea,select',
    opt: {
        required: [],
        FLnames: {}
    }
};

$(document).ready(function () {
    $(document).delegate('.FLajax', 'click', function(e) {
        e.preventDefault();
        FLsend($(this));
    });

    // Источник трафика
    if(!getData('FLreferrer') && (document.referrer)) {
        localStorage.setItem('FLreferrer', document.referrer);
    }
});

// Статус отправки 
function FLstatus(form, c, t) {
    var result = form.find(FLajax.status);
    if (c && t) {
        result.html('<div class="' + c + '">' + t + '</div>');
    } else if (!c && !t) {
        result.html('');
    }
}

// Функция отправки
function FLsend(e) {

    // обнуление набора
    FLajax.opt.required = [];
    FLajax.opt.FLnames = [];
    
    var err = false,
        allRequired = true,
        form = $(e).closest('form');

    // Функция валидации
    function FLcheck(th, form) {
        var type = th.attr('type');
        errorCase();

        /*switch (type) {
            case 'radio':
                if(form.find('[name="' + th.attr('name') + '"]:checked').length === 0) FLerror(th, form);
                else errorCase();
                break;

            default:
                if (th.val() === null || th.val().length < 1) FLerror(th, form);
                else errorCase();
        }*/
        
        function errorCase() {
            if (type !== 'file') FLajax.opt.required.push(th.attr('name'));
            //th.removeClass('has-error');
        }
    }

    // вывод ошибки
    function FLerror(th, form) {
        //err = true;
        //th.addClass('has-error');
        //FLstatus(form, 'error', FLajax.error);
    }

    form.find(FLajax.typesfield).each(function() {
        var th = $(this);
        if (th.attr('required') !== undefined) {
            allRequired = false;
            FLcheck(th, form);
        }

        // Добавляем имена полей в отдельный массив
        if (th.attr('type') !== 'file')
        FLajax.opt.FLnames[th.attr('name')] = th.is('[data-FL-name]') ? th.attr('data-FL-name') : 'name="' + th.attr('name') + '"';

    });

    if (allRequired) {
        form.find(FLajax.typesfield).each(function() {
            FLcheck($(this), form);
        });
    }

    if (err) {
        if (form.hasClass('cme')){
            FLstatus(form, 'error', FLajax.error);
        }
        return;
    }

    FLstatus(form, 'sending', FLajax.sending);

    var formData = new FormData(form[0]);

    // Источник трафика
    var rf = getData('FLreferrer');
    if (rf && rf.length > 0) {
        formData.append('FLreferrer', rf);
        FLajax.opt.FLnames['FLreferrer'] = FLajax.referrer;
    }

    // Страница с запросом
    formData.append('FLpageurl', location.href);
    FLajax.opt.FLnames['FLpageurl'] = FLajax.pageurl;

    var FLyaM = e.attr('data-FL-yaM');

    FLajax.opt.to = e.attr('data-FL-to');
    FLajax.opt.theme = e.attr('data-FL-theme');

    formData.append('opt', JSON.stringify(FLajax.opt));

    $.ajax({
        url: '/assets/snippets/FLajax/FLajax.php',
        type: 'post',
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        success: function(json) {
            var items = form.find(FLajax.typesfield);
            items.removeClass('has-error');
            if (json['status'] === false) {
                if (json['errors'].length !== 0) {
                    var err_log = true;
                    $.each(json['errors'], function(key, data) {
                        if (err_log) {
                            FLstatus(form, 'error', data['required']);
                            err_log = false;
                        }
                        items.filter('[name="' + key + '"]').addClass('has-error');
                    });
                } else if (json['messages'].length !== 0) {
                    FLstatus(form, 'error', json['messages']);
                } else {
                    FLstatus(form, 'error', FLajax.fatal_error);
                }
            } else {
                FLstatus(form, 'sent', FLajax.sent);
                e.attr('disabled', 'disabled');
                setTimeout(function(){
                    if (typeof($.fancybox) !== 'undefined'){
                        $.fancybox.close();
                    }
                }, 2000);
                if (FLyaM !== undefined) FLajax.yaMetrik(FLyaM);
            }
        },
        error: function(status) {
            console.log(status);
        }
    });
}

function getData(e) {
    return localStorage.getItem(e) || false;
}
