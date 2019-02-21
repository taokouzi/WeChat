<?php


/**
 * 对明文进行加密
 * @param string $text 需要加密的明文
 * @return string 加密后的密文
 */
public function encrypt($text, $appid)
{
    try {
        //获得16位随机字符串，填充到明文之前
        $random = $this->getRandomStr();//"aaaabbbbccccdddd";
        $text = $random . pack("N", strlen($text)) . $text . $appid;
        $iv = substr($this->key, 0, 16);
        $pkc_encoder = new PKCS7Encoder;
        $text = $pkc_encoder->encode($text);
        $encrypted = openssl_encrypt($text,'AES-256-CBC',substr($this->key, 0, 32),OPENSSL_ZERO_PADDING,$iv);
        return array(ErrorCode::$OK, $encrypted);
    } catch (Exception $e) {
        //print $e;
        return array(ErrorCode::$EncryptAESError, null);
    }
}





/**
 * 对密文进行解密
 * @param string $encrypted 需要解密的密文
 * @return string 解密得到的明文
 */
public function decrypt($encrypted, $appid)
{
    try {
        $iv = substr($this->key, 0, 16);          
        $decrypted = openssl_decrypt($encrypted,'AES-256-CBC',substr($this->key, 0, 32),OPENSSL_ZERO_PADDING,$iv);
    } catch (Exception $e) {
        return array(ErrorCode::$DecryptAESError, null);
    }
    try {
        //去除补位字符
        $pkc_encoder = new PKCS7Encoder;
        $result = $pkc_encoder->decode($decrypted);
        //去除16位随机字符串,网络字节序和AppId
        if (strlen($result) < 16)
            return "";
        $content = substr($result, 16, strlen($result));
        $len_list = unpack("N", substr($content, 0, 4));
        $xml_len = $len_list[1];
        $xml_content = substr($content, 4, $xml_len);
        $from_appid = substr($content, $xml_len + 4);
        if (!$appid)
            $appid = $from_appid;
        //如果传入的appid是空的，则认为是订阅号，使用数据中提取出来的appid
    } catch (Exception $e) {
        //print $e;
        return array(ErrorCode::$IllegalBuffer, null);
    }
    if ($from_appid != $appid)
        return array(ErrorCode::$ValidateAppidError, null);
    //不注释上边两行，避免传入appid是错误的情况
    return array(0, $xml_content, $from_appid); 
    //增加appid，为了解决后面加密回复消息的时候没有appid的订阅号会无法回复
}




?>