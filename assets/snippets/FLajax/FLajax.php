<?php
/**
 ***
 *** Flajax by https://github.com/milkamil93
 ***
 **/
// если не ajax, то выдаём 404 ошибку
if($_SERVER['HTTP_X_REQUESTED_WITH'] !== 'XMLHttpRequest') { 
    header("HTTP/1.0 404 Not Found");
    exit;
} 

header('Content-Type: application/json');

$config = include('FLconfig.php');

define('MODX_API_MODE', true);
include_once($_SERVER['DOCUMENT_ROOT'] . '/index.php');
$modx->db->connect();
if (empty ($modx->config)) {
    $modx->getSettings();
}
$modx->invokeEvent("OnWebPageInit");

// получаем email из админки, если в ресурсе 1 создана TV "mailto"
$email = $modx->getTemplateVar('mailto','*',1);
$config['to'] = !empty($email['value']) ? trim($email['value']) : $config['to']; 

$domen = parse_url ('http://'.$_SERVER["HTTP_HOST"]);
$domen = str_replace (['http://','www.'],'', $domen['host']);


// если включен SMTP, то берём email из настроек SMTP
$from = $modx->getConfig('email_method') == 'smtp' ? $modx->getConfig('smtp_username') : 'noreply@' . $domen; 

$_POST = filter_input_array(INPUT_POST);
$opt = json_decode($_POST['opt'], true);
$names = $opt['FLnames'];


// если в кнопке отправки задан атрибут data-FL-to, то получателя берём из атрибута
$config['to'] = isset($opt['to']) ? $opt['to'] : $config['to'];
if($config['to'] === 'to@to.to') exit;


// если в кнопке отправки задан атрибут data-FL-theme, то тему берём из атрибута
$config['theme'] = isset($opt['theme']) ? $opt['theme'] : $config['theme'];


// по умолчанию все обязательно, если к конкретным полям указать "required", то только они будут обязательными
$rules = []; 
if(isset($opt['required'])) {
    foreach ($opt['required'] as &$item) {
        $rules[$item] = [
            'required' => 'Заполните поле "' . $names[$item] . '"'
        ];
        unset($item);
    }
}

$formid = isset($_POST['formid']) ? $_POST['formid'] : 'basic';
unset($_POST['opt'],$_POST['formid']);

// формируем тело письма
$report = '@CODE:<div style="background:#f7fbff;border:1px solid #e5e5e5;padding:5px 15px;">'; 
foreach ($_POST as $key => &$item) {
    $report .= '<p><strong>' . $names[$key] . ':</strong> [+' . $key . '.value+]<br/></p>';
    unset($item,$key);
}
$report .= '</div><div style="background:#f5f5f5;border:1px solid #e5e5e5;padding:10px 15px;margin: 10px 0;">IP: ' . $_SERVER["REMOTE_ADDR"] . '</div>';

$filesname = '';
$i = 0;
foreach ($_FILES as $key => &$item) {
    ++$i;
    $filesname .= $i === count($_FILES) ? $key : $key . ',';
    unset($item,$key);
}

echo $modx->runSnippet('FormLister', [
    'defaultsSources' => 'param:contentDefaults',
    'api' => '1',
    'keepDefaults' => '1',
    'contentDefaults' => '{
		"formid": "' . $formid . '"
	}',
	'formid' => $formid,
    'protectSubmit' => '0',
    'rules' => json_encode($rules, JSON_UNESCAPED_UNICODE),
	'to' => $config['to'],
    'from' => $from,
	'subject' => $config['theme'],
	'reportTpl' => $report,
    'attachments' => $filesname
]);

?>