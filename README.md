# FLajax

Ajax для сниппета FormLister в Evolution CMS

## Описание

Генерация ajax запроса для сниппета FormLister на основе свёрстаной формы.

## Настройка

* Залить в корень сайта папку assets
* Подключить библиотеку jquery (разработка велась на версии 3.2.1, но должно работать и на версиях пониже)
* Подключить файл FLajax.js на сайте
* В кнопке отправки формы прописать класс FLajax
* Для отслеживания статуса отправки в форму добавить тег с классом "FLresult"
* Стилизировать has-error для полей
* В ресурсе с id 1(главная страница) создать TV "mailto" и туда указать email получателя

Этих настроек должно хватить, чтобы запустить ajax обработку. Для более тонкой настройки загляните в файлы FLajax.js и FLconfig.php ;-)

Из настроек фильтра доступен только required. По умолчанию все поля обязательные, но можно для определённых полей указать required.

## Пример

```
<html>
<head>
	<meta charset="utf-8">
	<script src="https://code.jquery.com/jquery-3.2.1.min.js"></script>
	<script src="assets/snippets/FLajax/FLajax.js" type="text/javascript"></script>
	<style>
		.has-error {
			border: 1px solid red;
		}
	</style>
</head>
<body>
	<form class="-visor-no-click">
		<p>
			<label for="name">Ваше имя</label>
			<input type="text" id="name" name="name" data-FL-name="Имя" />
		</p><p>
			<label for="phone">Ваш телефон</label>
			<input type="tel" id="phone" name="phone" data-FL-name="Телефон" required />
		</p><p>
			<label for="mail">Эл. почта</label>
			<input type="email" id="mail" name="email" data-FL-name="E-mail" />
		</p><p>
			<label for="comment">Комментарий</label>
			<textarea name="comment" id="comment" data-FL-name="Комментарий"></textarea>
		</p><p>
			<label for="file">Один файл</label>
			<input type="file" name="file" id="file"></textarea>
		</p><p>
			<label for="files">Несколько файлов</label>
			<input type="file" name="files[]" id="files" multiple></textarea>
		</p>
		<div class="FLresult"></div>
		<button class="FLajax" data-FL-to="mail_1@mail.ru,mail_2@mail.ru" data-FL-yaM="metka" data-FL-theme="Тестирование">Отправить</button>
	</form>
	
	<!-- Yandex.Metrika counter --> <script type="text/javascript" > (function (d, w, c) { (w[c] = w[c] || []).push(function() { try { w.yaCounter47027148 = new Ya.Metrika({ id:47027148, clickmap:true, trackLinks:true, accurateTrackBounce:true }); } catch(e) { } }); var n = d.getElementsByTagName("script")[0], s = d.createElement("script"), f = function () { n.parentNode.insertBefore(s, n); }; s.type = "text/javascript"; s.async = true; s.src = "https://mc.yandex.ru/metrika/watch.js"; if (w.opera == "[object Opera]") { d.addEventListener("DOMContentLoaded", f, false); } else { f(); } })(document, window, "yandex_metrika_callbacks"); </script> <noscript><div><img src="https://mc.yandex.ru/watch/47027148" style="position:absolute; left:-9999px;" alt="" /></div></noscript> <!-- /Yandex.Metrika counter -->
</body>
</html>
```
