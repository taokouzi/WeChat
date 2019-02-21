<?php

header('Content-type:application/javascript;charset=utf-8');



include_once "wxBizDataCrypt.php";

$appid = 'wx062a62641ea088e6';//小程序开发者的appid     洲际春天广场Lite（1099822659@qq.com）
$secret = 'ee46626556e22266f1656a3b426ac932';//小程序开发者的secret

$code = isset($_REQUEST['code'])?$_REQUEST['code']:'';

$encryptedData=isset($_REQUEST['encryptedData'])?$_REQUEST['encryptedData']:'';

$iv = isset($_REQUEST['iv'])?$_REQUEST['iv']:'';

$grant_type = "authorization_code"; //授权（必填）

$params = "appid=".$appid."&secret=".$secret."&js_code=".$code."&grant_type=".$grant_type;

$url = "https://api.weixin.qq.com/sns/jscode2session?".$params;

//echo $url."<hr>";

$res = json_decode(httpGet($url),true);
//$res = json_decode($this->httpGet($url),true);//类内的用法******************
//json_decode不加参数true，转成的就不是array,而是对象。

//print_r($res);

echo json_encode( ['openid'=>$res['openid'], 'session_key'=>$res['session_key'] ] );



$sessionKey = $res['session_key'];//取出json里对应的值

$pc = new WXBizDataCrypt($appid, $sessionKey);

$errCode = $pc->decryptData($encryptedData,$iv,$data);

if ($errCode == 0) {
    //print($data . "\n");
    //echo json_encode($data);
} else {
    //print($errCode . "\n");
    //echo json_encode($data);
}

function httpGet($url) {
	$curl = curl_init();
	curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($curl, CURLOPT_TIMEOUT, 500);
	curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);
	curl_setopt($curl, CURLOPT_URL, $url);
	$res = curl_exec($curl);
	curl_close($curl);
	return $res;
}