<?php
header('Content-type:application/javascript;charset=utf-8');    //设置页面编码格式
header("Access-Control-Allow-Origin: *");   //后台解决跨域
error_reporting(E_ERROR | E_WARNING | E_PARSE);
date_default_timezone_set('PRC');    //设置脚本中所有日期/时间函数使用的默认时区
session_start();

require('./pdo.php');

$action = $_REQUEST['action'];

switch ($action) 
{	


	// 存储用户信息
	case 'save_userInfo':

		$openid = $_REQUEST['openid'];
		$nick = $_REQUEST['nick'];
		$head = $_REQUEST['head'];
		$ctime = date('YmdHis');

		$sql = "SELECT count(1) as n 
				FROM `user`  
				WHERE `openid`='$openid'";
		$stmt = $pdo->query($sql);
		$row = $stmt->fetch(PDO::FETCH_ASSOC);
		
		if( $row['n'] == 0 )
		{
			$sql = "INSERT INTO `user` (`openid`,`head`,`nick`,`ctime`) 
					VALUES ( '$openid','$head','$nick','$ctime' )";
			$affected_rows=$pdo->exec($sql);

			exit( json_encode(array('code'=>1,'msg'=>'success' )) );
		}


	break;







	// banner图
	case 'banner':

		// local 1首页 2社区
		$local = $_REQUEST['local'];
		$nowTime = date('YmdHis');

		$sql = "SELECT b.`id`,b.`img`,b.`link`,b.`text`,b.`ctime` 
				FROM `banner` b 
				WHERE `is_show`='1' 
				AND b.`open_time`<='$nowTime'  
				AND b.`close_time`>'$nowTime' 
				AND b.`local`='$local' 
				ORDER BY `sort` 
				DESC";
		$stmt = $pdo->query($sql);

		$banner = array();
		$i = 0;
		while($row = $stmt->fetch(PDO::FETCH_ASSOC))
		{
			$banner[$i] = $row;
			$banner[$i]['img'] = 'https://www.oneh5.com/Lite/images/'.$banner[$i]['img'];
			
		    $i ++;
		}

		if( empty($banner) )
		{
			exit( json_encode(array('code'=>9013,'msg'=>'not data')) );
		}

       	exit( json_encode(array('code'=>1,'data'=>$banner )) );

	break;
	





	// 常用电话
	case 'tels':

		$sql = "SELECT `t_name`,`tel`,`status`,`ctime` 
				FROM `tels` 
				WHERE `is_show`='1' 
				ORDER BY `sort` 
				DESC";
		$stmt = $pdo->query($sql);

		$tels = array();
		$i = 0;
		while($row = $stmt->fetch(PDO::FETCH_ASSOC))
		{
			$tels[$i] = $row;
		    $i ++;
		}

		if( empty($tels) )
		{
			exit( json_encode(array('code'=>9013,'msg'=>'not data')) );
		}

       	exit( json_encode(array('code'=>1,'data'=>$tels )) );

	break;





	
	// 我的 回显
	case 'info':

		$openid = $_REQUEST['openid'];

		$yesterday = date("Ymd",strtotime("-1 day"));

		$sql = "SELECT `nums` 
				FROM `visit_list` 
				WHERE `ctime`='$yesterday'";
		$stmt = $pdo->query($sql);
		$row = $stmt->fetch(PDO::FETCH_ASSOC);
		// 昨日访问量
		$yesterday_num = (int)$row['nums'];


		$sql = "SELECT `nums` 
				FROM `visit`";
		$stmt = $pdo->query($sql);
		$row = $stmt->fetch(PDO::FETCH_ASSOC);
		// 总访问量
		$nums = $row['nums'];


		// 用户信息（昵称、头像）
		$sql = "SELECT `nick`,`head` 
				FROM `user` 
				WHERE `openid`='$openid'";
		$stmt = $pdo->query($sql);
		$row = $stmt->fetch(PDO::FETCH_ASSOC);
		$nick = $row['nick'];
		$head = $row['head'];


		$lvs = array(
				'1'=>'废铁',
				'2'=>'青铜',
				'3'=>'白银',
				'4'=>'黄金',
				'5'=>'铂金',
				'6'=>'钻石',
				'7'=>'王者'
			);
		

		$sql = "SELECT us.`num`,us.`lv` 
				FROM `user_sign` us,`user` u 
				WHERE us.`user_id`=u.`id` 
				AND u.`openid`='$openid'";
		$stmt = $pdo->query($sql);
		$row = $stmt->fetch(PDO::FETCH_ASSOC);


		$lv = '1';
		$visit_day_num = 0;

		if( $row )
		{
			$lv = $row['lv'];
			$visit_day_num = $row['num'];   //打卡天数
		}
		
		$lv_name = $lvs[$lv];


		
		$sql = "SELECT  
				u.`openid` 
				FROM `user_sign` us,`user` u 
				WHERE us.`user_id`=u.`id` 
				ORDER BY us.`num` DESC,us.`mtime` ASC";
		$stmt = $pdo->query($sql);

		$mc = 0;
		$i = 1;
		while ( $row = $stmt->fetch(PDO::FETCH_ASSOC) ) 
		{
			if( $row['openid'] == $openid )
			{
				$mc = $i;
			}
			$i ++;
		}


		$data = array(
					'nick'=>$nick,
					'head'=>$head,
					'yesterday_num'=>$yesterday_num,
					'nums'=>$nums,
					'lv'=>$lv,
					'lv_name'=>$lv_name,
					'visit_day_num'=>$visit_day_num,
					'mc'=>$mc
				);

		exit( json_encode(array('code'=>1,'data'=>$data )) );

	break;




	// 记录访问量
	case 'up_visit':

		// 总访问量+1
		$sql = "UPDATE `visit` v 
				SET `nums` = (v.`nums`+1)";
		$affected_rows=$pdo->exec($sql);


		$sql = "SELECT `ctime` 
				FROM `visit_list` 
				ORDER BY `ctime` 
		 		DESC";
		$stmt = $pdo->query($sql);
		$row = $stmt->fetch(PDO::FETCH_ASSOC);

		$lateDay = (int)$row['ctime'];
		$today = (int)date('Ymd');

		// 如果间隔超过1天 没有人访问，则更新到访问表中昨日的时间 访问量为0
		if( $today > $lateDay + 1 )
		{
			for( $i = $lateDay ; $i < $today ; $i++ )
			{
				$sql = "INSERT INTO `visit_list` (`nums`,`ctime`) 
						VALUES ( '0','$i')";
				$affected_rows=$pdo->exec($sql);
			}
		}
		

		// 当日访问量
		$sql = "SELECT count(1) as v 
				FROM `visit_list` 
				WHERE `ctime`='$today'";
		$stmt = $pdo->query($sql);
		$row = $stmt->fetch(PDO::FETCH_ASSOC);

		if( $row['v'] == 0 )
		{
			$sql = "INSERT INTO `visit_list` (`nums`,`ctime`) 
					VALUES ( '1','$today')";
		}
		else
		{
			$sql = "UPDATE `visit_list` vl 
					SET `nums` = (vl.`nums`+1)
					WHERE `ctime`='$today'";
		}
		$affected_rows=$pdo->exec($sql);

		exit( json_encode(array('code'=>1,'msg'=>'success' )) );

	break;




	// 打卡状态回显
	case 'sign_status':
		
		$openid = $_REQUEST['openid'];
		$today = date('Ymd000000');

		$sql = "SELECT count(1) as s 
				FROM `user_sign` us,`user` u 
				WHERE u.`openid`='$openid' 
				AND u.`id`=us.`user_id` 
				AND us.`mtime`>'$today'";

		$stmt = $pdo->query($sql);
		$row = $stmt->fetch(PDO::FETCH_ASSOC);

		exit( json_encode(array('code'=>1,'status'=>$row['s'],'msg'=>'1已打卡，0未打卡' )) );

	break;




	// 打卡
	case 'sign':
		
		$openid = $_REQUEST['openid'];
		$mtime = date('YmdHis');

		$sql = "SELECT `id`,count(1) as u 
				FROM `user` 
				WHERE `openid`='$openid'";
		$stmt = $pdo->query($sql);
		$row = $stmt->fetch(PDO::FETCH_ASSOC);

		if( $row['u'] == 0 )
		{
			exit( json_encode(array('code'=>9002,'msg'=>'not find user')) );
		}

		$userID = $row['id'];
		$sql = "SELECT `num`,count(1) as us  
				FROM `user_sign` 
				WHERE `user_id`='$userID'";
		$stmt = $pdo->query($sql);
		$row = $stmt->fetch(PDO::FETCH_ASSOC);

		$num = (int)$row['num'];

		if( $num < 9 )
		{
			$lv = 1;
		}
		else if( $num >= 9 && $num < 39 )
		{
			$lv = 2;
		}
		else if( $num >= 39 && $num < 79 )
		{
			$lv = 3;
		}
		else if( $num >= 79 && $num < 159 )
		{
			$lv = 4;
		}
		else if( $num >= 159 && $num < 319 )
		{
			$lv = 5;
		}
		else if( $num >= 319 && $num < 639 )
		{
			$lv = 6;
		}
		else if( $num >= 639 )
		{
			$lv = 7;
		}


		if( $row['us'] == 0 )
		{
			$sql = "INSERT INTO `user_sign` (`user_id`,`num`,`lv`,`mtime`,`ctime`) 
					VALUES ( '$userID','1','1','$mtime','$mtime')";
			$affected_rows=$pdo->exec($sql);
			exit( json_encode(array('code'=>1,'msg'=>'oko , welcome' )) );
		}
		else
		{
			$today = date('Ymd000000');
			$sql = "SELECT count(1) as i 
					FROM `user_sign` us 
					WHERE `user_id`='$userID' 
					AND us.`mtime`>= '$today'";
			$stmt = $pdo->query($sql);
			$row = $stmt->fetch(PDO::FETCH_ASSOC);
	
			if( $row['i'] > 0 )
			{
				exit( json_encode(array('code'=>9004,'msg'=>'toady is sign')) );
			}
			else
			{
				$sql = "UPDATE `user_sign` us 
						SET `num`=(us.`num`+1),`lv`='$lv',`mtime`='$mtime' 
						WHERE `user_id`='$userID'";
			
				$affected_rows = $pdo->exec($sql);
				exit( json_encode(array('code'=>1,'msg'=>'update ok' )) );
			}
		}
		
	break;




	// 打卡排行
	case 'rank':
		
		$openid = $_REQUEST['openid'];

		$now = date('YmdHis');

		$sql = "SELECT u.`openid`,u.`head`,u.`nick`,us.`lv`,us.`num` 
				FROM `user_sign` us,`user` u 
				WHERE us.`user_id`=u.`id` 
				ORDER BY us.`num` DESC,us.`mtime` ASC 
		 		LIMIT 20";
		$stmt = $pdo->query($sql);


		$lvs = array(
				'1'=>'废铁',
				'2'=>'青铜',
				'3'=>'白银',
				'4'=>'黄金',
				'5'=>'铂金',
				'6'=>'钻石',
				'7'=>'王者'
			);
		$rank = array();
		$i = 0;
		while ( $row = $stmt->fetch(PDO::FETCH_ASSOC) ) 
		{
			$is_me = $row['openid'] == $openid ? '1' : '0';

			$rank[$i]['openid'] = $row['openid'];
			$rank[$i]['head'] = $row['head'];
			$rank[$i]['nick'] = $row['nick'];
			$rank[$i]['lv'] = $row['lv'];
			$rank[$i]['lv_name'] = $lvs[$row['lv']];
			$rank[$i]['is_me'] = $is_me;
			$rank[$i]['mc'] = ($i+1);
			$rank[$i]['num'] = $row['num'];

			$i ++;
		}
		
		exit( json_encode(array('code'=>1,'data'=>$rank )) );


	break;










	// 记录阅读量并返回
	case 'readnum':
		
		$r_status = $_REQUEST['r_status'];

		$sql = "UPDATE `read_num` rn 
				SET `num`=(rn.`num`+1) 
				WHERE `r_status`='$r_status'";
		$affected_rows = $pdo->exec($sql);


		$sql = "SELECT `num` 
				FROM `read_num` 
				WHERE `r_status`='$r_status'";
		$stmt = $pdo->query($sql);
		$row = $stmt->fetch(PDO::FETCH_ASSOC);

		exit( json_encode(array('code'=>1,'num'=>$row['num'] )) );

	break;







	case 'share':

		$sql = "SELECT * 
				FROM `share`";
		$stmt = $pdo->query($sql);
		$row = $stmt->fetch(PDO::FETCH_ASSOC);

		$row['img'] = 'https://www.oneh5.com/Lite/images/'.$row['img'];
		exit( json_encode(array('code'=>1,'data'=>$row )) );

	break;




}

?>