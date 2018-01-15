<?php
// если не ajax, то выдаём 404 ошибку
if($_SERVER['HTTP_X_REQUESTED_WITH'] !== 'XMLHttpRequest') { 
    header("HTTP/1.0 404 Not Found");
    exit;
}

header('Content-Type: application/json');
define('MODX_API_MODE', true);


//$config['path'] = $_SERVER['DOCUMENT_ROOT'];
// работает не правильно, если включены автоподдомены (reg.ru)
$config['path'] = dirname(dirname(dirname(dirname(__FILE__)))); 

include_once 'FLconfig.php';
include_once $config['path'] . '/assets/cache/siteManager.php';
include_once $config['path'] . '/' . MGR_DIR . '/includes/config.inc.php';
include_once $config['path'] . '/' . MGR_DIR . '/includes/document.parser.class.inc.php';

$modx = new DocumentParser;
$modx->db->connect();
$modx->getSettings();
startCMSSession();
$modx->minParserPasses = 2;


// получаем email из админки, если в ресурсе 1 создана TV "mailto"
$email = $modx->getTemplateVar('mailto','*',1);
$config['to'] = $email['value'] !== '' ? trim($email['value']) : $config['to']; 

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
    foreach ($opt['required'] as $item) {
        $rules[$item] = [
            "required" => "Поле «" . $names[$item] . "» обязательно для заполнения"
        ];
    }
}

$formid = isset($_POST['formid']) ? $_POST['formid'] : 'basic';
unset($_POST['opt'],$_POST['formid']);

// формируем тело письма
$report = '@CODE:<div style="background:#f7fbff;border:1px solid #e5e5e5;padding:5px 15px;">'; 
foreach ($_POST as $key => $item) {
    $report .= '<p><strong>' . $names[$key] . ':</strong> [+' . $key . '.value+]<br/></p>';
}
$report .= '</div><div style="background:#f5f5f5;border:1px solid #e5e5e5;padding:10px 15px;margin: 10px 0;">IP: ' . $_SERVER["REMOTE_ADDR"] . '</div>';

$filesname = '';
$i = 0;
foreach ($_FILES as $key => $item) {
    ++$i;
    $filesname .= $i === count($_FILES) ? $key : $key . ',';
}

echo $modx->runSnippet('FormLister', [
    'defaultsSources' => 'param:contentDefaults',
    'api' => '1',
    'keepDefaults' => '1',
    'contentDefaults' => '{
		"formid": ' . $formid . '
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
