// src/Perform/pages/ArtistPage.jsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ArtistPage.css';

import SongModal from '../components/SongModal';
import { ReactComponent as ArrowIcon } from '../../assets/design-mockup.svg';

import yudabin1 from '../images/yudabin1.jpg';
import yudabin2 from '../images/yudabin2.jpg';
import yudabin3 from '../images/yudabin3.jpg';
import yudabin4 from '../images/yudabin4.jpg';
import yudabin5 from '../images/yudabin5.jpg';
import yudabin6 from '../images/yudabin6.jpg';
import yudabin7 from '../images/yudabin7.jpg';

import ichaeyeon1 from '../images/ichaeyeon1.jpg';
import ichaeyeon2 from '../images/ichaeyeon2.jpg';
import ichaeyeon3 from '../images/ichaeyeon3.jpg';
import ichaeyeon4 from '../images/ichaeyeon4.jpg';
import ichaeyeon5 from '../images/ichaeyeon5.jpg';
import ichaeyeon6 from '../images/ichaeyeon6.jpg';
import ichaeyeon7 from '../images/ichaeyeon7.jpg';

const juchangLinks = {
  '1': 'https://m.blog.naver.com/PostView.naver?blogId=joochangyun&logNo=223563056230&navType=by',
  '2': 'https://m.blog.naver.com/PostView.naver?blogId=joochangyun&logNo=223343742157&navType=by',
  '3': 'https://m.blog.naver.com/PostView.naver?blogId=joochangyun&logNo=222994954310&navType=by',
  '4': 'https://m.blog.naver.com/PostView.naver?blogId=joochangyun&logNo=222992414970&navType=by',
  '5': 'https://m.blog.naver.com/PostView.naver?blogId=joochangyun&logNo=223576005028&navType=by',
  '6': 'https://youtu.be/a2pGIOg5BGY?si=NqJnC6BMOXkR6_jy',
};

const artistData = {
  juchang: {
    name: '주창윤 교수님',
    songs: [
      { id: '1', title: '사랑의 의지' },
      { id: '2', title: '에로스의 회복' },
      { id: '3', title: '사랑의 파괴' },
      { id: '4', title: '사랑할 용기' },
      { id: '5', title: '사랑받고 있다는 거 눈치채!' },
      { id: '6', title: '주창윤 교수님의 환승연애2 리액션' },
    ],
  },
  yudabin: {
    name: '유다빈 밴드',
    songs: [
      { id: '1', title: '좋지 아니한가',       imageUrl: yudabin1 },
      { id: '2', title: '향해',               imageUrl: yudabin2 },
      { id: '3', title: 'LETTER',             imageUrl: yudabin3 },
      { id: '4', title: '백일몽',              imageUrl: yudabin4 },
      { id: '5', title: '오늘이야',            imageUrl: yudabin5 },
      { id: '6', title: 'ONCE',               imageUrl: yudabin6 },
      { id: '7', title: '계속 웃을 순 없어!', imageUrl: yudabin7 },
    ],
  },
  ichaeyeon: {
    name: '이채연',
    songs: [
      { id: '1', title: 'KNOCK',               imageUrl: ichaeyeon1 },
      { id: '2', title: 'I don’t wanna Know',  imageUrl: ichaeyeon2 },
      { id: '3', title: 'Don’t Be A Jerk',     imageUrl: ichaeyeon3 },
      { id: '4', title: 'HUSH RUSH',           imageUrl: ichaeyeon4 },
      { id: '5', title: 'Don’t',               imageUrl: ichaeyeon5 },
      { id: '6', title: 'Summer Heat',         imageUrl: ichaeyeon6 },
      { id: '7', title: 'Let’s Dance',         imageUrl: ichaeyeon7 },
    ],
  },
};

const lyricsData = {
  juchang: {
    '1': '가사를 제공하지 않습니다.',
    '2': '가사를 제공하지 않습니다.',
    '3': '가사를 제공하지 않습니다.',
    '4': '가사를 제공하지 않습니다.',
    '5': '가사를 제공하지 않습니다.',
    '6': '가사를 제공하지 않습니다.',
    '7': '가사를 제공하지 않습니다.',
  },
  yudabin: {
'1': `나무가 사라져간 산길
주인 없는 바다
그래도 좋지 아니한가
내 마음대로 되는 세상
밤이 오면 싸워왔던 기억
일기를 쓸만한 노트와
연필이 생기지 않았나
내 마음대로 그린 세상
저 푸른 하늘 구름 위에
독수리 높이 날고
카우보이 세상을 삼키려 하고
총성은 이어지네
TV 속에 싸워 이긴 전사
일기 쓰고 있는 나의 천사
도화지에 그려질 모습
그녀가 그려갈 세상
우린 노래해 더 나아질 거야
우린 추억해
부질없이 지난날들
바보같이 지난날들
그래도 우린 좋지 아니한가
바람에 흐를 세월 속에
우리 같이 있지 않나
이렇게 우린 웃기지 않는가
울고 있었다면
다시 만날 수 없는 세상에
우린 태어났으니깐
우린 노래해 더 나아질 거야
우린 추억해
부질없이 지난날들
바보같이 지난날들
그래도 너는 좋지 아니한가
강물에 넘칠 눈물 속에
우리 같이 있지 않나
이렇게 우린 웃기지 않는가
울고 있었다면
다시 만날 수 없는 세상이
멋지지 않았는가
아아아
그녀가 그려 갈 세상`,

'2': `수없이 연결된 실 속에서 사랑한 너와 나의 모습은
헝클어진 채로 버려지고 말았지
영원히 남을 매듭과 시간의 흐름을 기억하는 것
바라지 않았던 눈보라 속에
빗발치듯이 쏟아진 눈물
얼어버린 발은 무뎌지고
따스한 약속은 잊어버렸네
어두운 이 밤을 스치는 바람
숨이 막히게 조여오던 삶
이제야 마주한 꿈의 대양
춤을 추듯이 흘러가보자
믿을 수 없을 만큼 아름다운
그 바다로 함께 갈 수 있다면
새벽 속에 들려온 목소리를 들어봐
우리는 어디서 왔으며 어디로 사라질까
지난 시간의 흐름을 기억해 내는 것
그것만이 우리가 갈 수 있는 단 하나의 꿈이야
어두운 이 밤을 스치는 바람
숨이 막히게 조여오던 삶
이제야 마주한 꿈의 대양
춤을 추듯이 흘러가보자
믿을 수 없을 만큼 아름다운
그 바다로 함께 갈 수 있다면
새벽 속에 들려온 목소리를 들어봐
우리는 어디서 왔으며 어디로 사라질까
지난 시간의 흐름을 기억해 내는 것
그것만이 우리가 갈 수 있는 내일이야
그것만이 우리가 갈 수 있는
단 하나의 꿈이야`, 

'3':`빛나는 날을 허락해 주세요
시들지 않는 사랑을 주세요
소리 없는 말을 해주세요
날 미친 사람이래도 좋아요
화려하게 장식된 말들은 필요 없어요
그 거짓 사이로 나의 창틀에도 가끔
햇빛이 반짝일 수 있다면
그러니 그대의
빛나는 날을 허락해 주세요
시들지 않는 사랑을 주세요
소리 없는 말을 해주세요
날 미친 사람이래도 좋아요
속이 없는 인사에 외로워질 때가 있어요
그 고요 사이로 나의 창틀에도 가끔
햇빛이 반짝일 수 있다면
그러니 그대의
기나긴 밤을 허락해 주세요
잠들지 않는 사랑을 주세요
소리 없는 말을 해주세요
날 미친 사람이래도 좋아요
라라라 라라라라 라라라라
라라라 라라라라 라라라라
난 멈출 수 없이 노래해요
바보 같은 사람이래도 좋아요`,

'4' : `내가 갈 곳은 어디도 없지만
정처 없이 갈 곳을 헤매이죠
병들고 미운 마음
돌을 마구 던지며 울었어요
여전히 속뜬 마음
재가 되어 나리는 하늘
또 늦어지는 나의 발걸음
그늘진 모양조차도 싫은 날
재가 되어 나리는 하늘
또 늦어지는 나의 발걸음
나는 꿈을 꾸었던 것 같아요
발을 맞춰오던 건물 속의 난
어느샌가 얼굴을 지운 채로
잘게 구겨진 마음
길에 눈을 떨군 채 울었어요
여전히 속뜬 마음
여전히 속뜬 마음
재가 되어 나리는 하늘
또 늦어지는 나의 발걸음
그늘진 모양조차도 싫은 날
재가 되어 나리는 하늘
또 늦어지는 나의 발걸음
나는 꿈을 꾸었던 것 같아
꿈을 꾸는 것만 같아요
재가 되어 나리는 하늘
또 늦어지는 나의 발걸음
그늘진 모양조차도 싫은 날
재가 되어 나리는 하늘
또 늦어지는 나의 발걸음
나는 꿈을 꾸는 것만 같아
꿈을 꾸었던 것 같아요`,

'5' : `돌아봐 이 순간의 선물은
나의 눈빛을 다시 만날 때 반짝일 거야
삶에 지쳐 울어도
돌아봐 이 순간의 꿈들을
내가 바라던 찬란한 빛이 내릴 곳 바로 오늘이야
본 적 있던 것 같아 한때 그 영화 속에서
누군가의 모습을 닮았던 노을 진 바다를
가끔 나는 잊어버리고 싶은 내 꿈속에서
어두운 밤의 끝을 바래
멀어져 가던 지난날들이 불어올 때
눈을 감으면 선명해지는 숨을 내쉬며
돌아봐 이 순간의 선물은
나의 눈빛을 다시 만날 때 반짝일 거야
삶에 지쳐 울어도
돌아봐 이 순간의 꿈들을
내가 바라던 찬란한 빛이 내릴 곳 바로 오늘이야
어지러운 마음에 조금 넘어져도 괜찮아
새로운 내일의 나에게 눈 감지 않아
멀어져 가던 지난날들이 불어올 땐
손 틈 사이로 스며드는 숨을 내쉬며
돌아봐 이 순간의 선물은
나의 눈빛을 다시 만날 때 반짝일 거야
삶에 지쳐 울어도
돌아봐 이 순간의 꿈들을
내가 바라던 찬란한 빛이 내릴 곳 바로 오늘이야
남은 우리 날은 어딜 비출까
기억 너머 황홀함을 잊진 않을까
좋은 날도 흐린 날도
지나갈 듯 머물러 있는
푸른 우리 봄의 꿈이기에
남은 우리 날은 어딜 비출까
기억 너머 황홀함을 잊진 않을까
좋은 날도 흐린 날도
지나갈 듯 머물러 있는
푸른 우리 봄의 꿈이기에`,

'6' : `발끝을 모아 소중히 내려놓아 두네
남겨진다는 건 왜 외로워야만 할까
벼랑에 서도 이제는 숨 막히지 않아
난 너와 다른 바람을 느껴도 함께 있는 거야
이대로 아
아
난 서두르고 싶진 않아
너와
아
난 이것만으로 충분해
단 한 번에 널 사랑할 수 있었어
한순간들도 빠짐없이 사랑하고 있어
단 한 번만 더 다정히 날 기억해 줄래
이렇게 포개어 모은 손에 너를 불러보네
버릴 수 없는 후회와 밀려오는 나날
멀어진다는 건 왜 익숙할 수 없을까
눈물을 닦아내고서 내일에 외치네
우리는 언제나 그랬듯이 함께 있을 거야
이대로 아
아
난 서두르고 싶진 않아
너와
아
난 이것만으로 충분해
단 한 번에 널 사랑할 수 있었어
한순간들도 빠짐없이 사랑하고 있어
단 한 번만 더 다정히 날 기억해 줄래
마지막으로
포개어 모은 손에 너를 불러보네`,

'7' : `우우우 
간밤에 오가던 많은 사람들은
바쁘게 춤을 추다
산산이 흩어지네 
우후후
어쨌든 나랑은 별로 상관없지
방문을 두드리는 소리가 커져가지만  
계속 웃을 순 없어
간만에 내 얼굴이 예뻐 보여도
계속 웃을 순 없어
답답한 내 잔고가 채워진대도
계속 웃을 순 없어 
길거리를 뒹구는 찌그러진 컵을 봐
갈 곳도 모르고 도망가네
나도 길을 잃어버려 갈 곳을 몰라
뭐 다들 그렇게 사는 거 아니었나? 
전부 잊혀지는 거야
선명히 비치던 
알고 싶지 않은 모든 것이 
이젠 지워지는 거야 
불타오르는 몸짓 속에  
전부 잊혀지는 거야 
선명히 비치던 
알고 싶지 않은 모든 것이 
이젠 지워지는 거야 
불타오르는 몸짓 속에  
계속 웃을 순 없어 
간만에 내 얼굴이 예뻐 보여도 
계속 웃을 순 없어 
답답한 내 잔고가 채워진대도 
계속 웃을 순 없어 
간만에 내 얼굴이 예뻐 보여도 
계속 웃을 순 없어 
답답한 내 잔고가 채워진대도`

  },
  ichaeyeon: {
    '1': `Knock Knock Knock
Knock Knock Knock Knock Knock Knock Knock
Knocking on your heart
Knock Knock Knock Knock Knock Knock
Knock Knock Knock Knock Knock Knock Knock
Knocking on your heart

가만가만히 들여다보는 건
마음에 안 들어 (nope)
까만 밤하늘 수놓은 별처럼
콕 콕 마음에 박혀

세상에 눈을 뜬 후로
Hard for me to control
끌리는 마음이 So I feel special
눈이 마주치면
Come a little closer
Come closer come closer
이제 깨어나

Knock Knock Knock Knock Knock Knock
Knock Knock Knock Knock Knock Knock Knock
Knocking on your heart
Knock Knock Knock Knock Knock Knock
Knock Knock Knock Knock Knock Knock Knock
Knocking on your heart

날 위로 더 위로 올려 이 순간
Come over the moonlight
Starry-eyed, Get me high 바로 오늘 밤
Knock Knock Knocking on your heart

매일 주시하며 살지 마 굳이 어때
많고 적고 별 차이 알아도 No 상관없지
솔직히 살아도 돼 그래 자연스럽게
똑똑하면 잘해봐

세상에 눈을 뜬 후로
Hard for me to control
끌리는 마음이 So I feel special
눈이 마주치면
Come a little closer
Come closer come closer
이제 깨어나

Knock Knock Knock Knock Knock Knock
Knock Knock Knock Knock Knock Knock Knock
Knocking on your heart
Knock Knock Knock Knock Knock Knock
Knock Knock Knock Knock Knock Knock Knock
Knocking on your heart

날 위로 더 위로 올려 이 순간
Come over the moonlight
Starry-eyed, Get me high 바로 오늘 밤
Knock Knock Knocking on your heart

더 이상 기다리게는 하지 마
두드리면 깨질 걸 널 아니까
이 밤이 더디게 더디게 가
Come a little closer

La la la la la la
La la la la la la la la la
All I wanna do

Knock Knock Knock Knock Knock Knock
Knock Knock Knock Knock Knock Knock Knock
Knocking on your heart

날 위로 더 위로 올려 이 순간
Come over the moonlight
Starry-eyed, Get me high 바로 오늘 밤
Knock Knock Knocking on your heart

Knock Knock Knock Knock Knock Knock
Knock Knock`,

'2': `I moved on, don't stop me now
복잡한 건 싫어
Because I'm a freak
I'm gonna let it all up
다 사라져버려
내겐 더 중요한 건 없어

불투명한 안개에 싸여
사라지고 싶어 I'm so tired
끊임없게 날 유혹하니까
자꾸 들려 What do you desire?
차단해 다 밀어내
소신껏 더 행동해
복잡한 생각은 off 해
더 이상 내버려 둬 fade

I don't wanna know
I don't wanna know
I don't wanna know
I don't wanna know
Wanna let loose
I don't wanna know
Set it free
I don't wanna know
Wanna let loose
I don't wanna know
Leave it be

I moved on, don't stop me now
복잡한 건 싫어
Because I'm a freak
I'm gonna let it all up
다 사라져버려
내겐 더 중요한 건 없어

불투명한 안개에 싸여
사라지고 싶어 I'm so tired
끊임없게 날 유혹하니까
자꾸 들려 What do you desire?
차단해 다 밀어내
소신껏 더 행동해
복잡한 생각은 off 해
더 이상 내버려 둬 fade

I don't wanna know
I don't wanna know
I don't wanna know
I don't wanna know
Wanna let loose
I don't wanna know
Set it free
I don't wanna know
Wanna let loose
I don't wanna know
Leave it be`,

'3': `I don't care about them
Oh yeah yeah yeah
자유롭길 원해 yes I I do
남들과 똑같은 게
누구보다 싫은데
틀린 것도 괜찮아
당당하게 걸어 my way

보는 눈이 없는 거리에서
누구보다 너답게
욕심조차 없는 이곳에서
진짜 너를 찾아봐
So what 그게 너니까
Come here don't be a jerk

이젠 더 빨리
더 멀리 더 높이 올라가
해봐 더 많이
등 돌리면 더 기회 없지
어둠을 가려 빛을 비춰
반짝 빛날 테니
이젠 더 빨리 해 해봐 빨리
Let's get it started

Don't don't don't don't don't
Don't don't don't don't don't you
Don't don't don't don't don't
Don't be a jerk

Don't don't don't don't don't
Don't don't don't don't don't you
Don't don't don't don't don't
Don't be a jerk

조금은 지쳤나 봐 맞지 않는 옷처럼
그동안 날 구속했나 봐
이제는 난 달라
눈을 떠 멀리 봐 봐
즐거운 게 참 많아
모든 게 다 타이밍이야
바로 지금이야

따라 해도 좋아 넌 너니까
당당하게 질러봐
어디까지 갈지 모르니까
끝은 알 수 없잖아
So what 이게 나니까
Come here don't be a jerk

이젠 더 빨리
더 멀리 더 높이 올라가
해봐 더 많이
등 돌리면 더 기회 없지
어둠을 가려 빛을 비춰
반짝 빛날 테니
이젠 더 빨리 해 해봐 빨리
Let's get it started

This is my dream I just want it
저기 저 멀리 올라가 높이

이젠 더 빨리
더 멀리 더 높이 올라가
해봐 더 많이
등 돌리면 더 기회 없지
어둠을 가려 빛을 비춰
반짝 빛날 테니
이젠 더 빨리 해 해봐 빨리
Let's get it started

Don't don't don't don't don't
Don't don't don't don't don't you
Don't don't don't don't don't
Don't be a jerk

Don't don't don't don't don't
Don't don't don't don't don't you
Don't don't don't don't don't
Don't be a jerk`,

'4': `Over the moon
어지럽게
일렁여 자꾸
중력을 잃은 채

막이 오른 뒤
멈추지 않을 step
시작된 내 맘에
빛이 가득가득해
더 숨 가쁘가쁘게

Hush rush, on the stage
미쳐 가 더 I done
(done… done … done)

미쳐가 더 I don't care
(done… done… done)

Hush rush, on the stage

눈부신 달빛에
(I love it, I love it, I love it, I love it)
Hush rush, on the stage

마주친 눈빛에
(I love it, I love it, I love it, I love it)
Hush rush, on the stage

멈추지 않는 떨림이
나를 춤추게 해 I'm fallin' in
미쳐가 더 아득해
(I love it, I love it, I love it, I love it)

리듬은 sweet
간지럽게
온 감각을 뺏어
이건 마치 Jump'in love

저항 없이 lose
몸을 맡긴 채
몰입해 더 feel me
소름이 확 끼치게
빛을 갈라 Holler yeah

Hush rush, on the stage
미쳐 가 더 I done
(done… done … done)

미쳐가 더 I don't care
(done… done… done)

Hush rush, on the stage

펼쳐진 그 빛에
(I love it, I love it, I love it, I love it)
Hush rush, on the stage

활짝 핀 내 맘에
(I love it, I love it, I love it, I love it)
Hush rush, on the stage

빨라진 두근거림이
절대 멈추지 않게 call'in me
빠져 가 더 아득해
(I love it, I love it, I love it, I love it)
Hush rush, on the stage

유혹하듯 먼
(I know it, I know it, I know it, I know it)
어딘가의 Dreams
(I love it, I love it, I love it, I love it)
속삭이듯이
(holic me, holic me, holic me, holic me)
Sweat 춤을 춰 우리 (I love it, I love it)

눈부신 달빛에
(I love it, I love it, I love it, I love it)
Hush rush, on the stage

마주친 눈빛에
(I love it, I love it, I love it, I love it)
Hush rush, on the stage

멈추지 않는 떨림이
나를 춤추게 해 I'm fallin' in
미쳐가 더 아득해
(I love it, I love it, I love it, I love it)
Hush rush, on the stage

펼쳐진 그 빛에
(I love it, I love it, I love it, I love it)
Hush rush, on the stage

활짝 핀 내 맘에
(I love it, I love it, I love it, I love it)
Hush rush, on the stage

빨라진 두근거림이
절대 멈추지 않게 call'in me
빠져 가 더 아득해
(I love it, I love it, I love it, I love it)
Hush rush, on the stage`,

'5': `거지 같은 전화에 끊지를 못해 왜
이딴 대화할 거라면 미친 척이라도 해
그럼 또 난 믿지

Ring my bell Ring my bell Ring my bell
이러다가도
빨간색 누르고 Ha Ha Ha
나 보고 싶지
Long time no see my name
Stop Don't call me

Dumb
말해 뭐해 뭐라고 밤이면 밤마다
할 말이 뭐야
Don't play dumb with me
보고 싶다 말해 또
흔들리겠지만 뚝 끊을 거야
뚜 뚜 뚜 뚜 뚜 뚜 뚜 뚜

Don't Don't Don't Don't Don't
Don't call me Charlie
Don't Don't Don't Don't Don't
Please call me Charlie

Don't Don't Don't Don't
Don't call me Charlie
Don't Don't Don't Don't Don't
Please call me Charlie

(Wish wish) 다시 돌아가자 Baby
(Please please) 아니 그러지 마 Charlie
빙빙 돌아가 버릴 것 같아
Crazy It's never easy
아 앗 Missed call
I miss you so much
난 마음 약해져 넌 참 아쉬워 보여

Ring my bell Ring my bell Ring my bell
이러다가도
빨간색 누르고 Ha Ha Ha
나 보고 싶지
Long time no see my name
Stop Don't call me

Dumb
말해 뭐해 뭐라고 밤이면 밤마다
할 말이 뭐야
Don't play dumb with me
보고 싶다 말해 또
흔들리겠지만 뚝 끊을 거야
뚜 뚜 뚜 뚜 뚜 뚜 뚜 뚜

Don't Don't Don't Don't Don't
Don't call me Charlie
Don't Don't Don't Don't Don't
Please call me Charlie

Don't Don't Don't Don't
Don't call me Charlie
Don't Don't Don't Don't Don't
Please call me Charlie

싹 변하네 어차피 It's too late
Oh, I don't want it
더 착각하지 마 Done
No more freaking call at 2am
Stop Don't call me

Don't Don't Don't Don't Don't
Don't call me Charlie
Don't Don't Don't Don't Don't
Please call me Charlie

Don't Don't Don't Don't
Don't call me Charlie
Don't Don't Don't Don't Don't
Please call me Charlie`,

'6': `Can you see it?
뜨거운 태양에 kiss ya
끓어올라
멈출 수 없는 climax
Oh 달아오른 모래 위로 jumpin'
끈적한 이 바람 타고 dancin'
자 시작이야
Let's play all night
불붙은 party 너와 나

이 순간 시간을 얼려줘
Volume을 키워 loud loud
본능대로 움직여 make it hot
1분 1초가 아깝잖아 oh
(Come in)

Summer heat
Can we freeze?
Let's get lost for days
Summer heat
Can we freeze?
We're wild and free

Feel feel feel feel the heat heat heat
Summer heat
Can we freeze?
We're wild and free

기다렸던 날
터질듯한 vibe
Raining on my mind
잔뜩 녹아내려
춤춰 발걸음을 맞춰 up & down
잠들지 마
Let's play all night
불붙은 party 너와 나

이 순간 시간을 얼려줘
Volume을 키워 loud loud
본능대로 움직여 make it hot
1분 1초가 아깝잖아 oh
(Come in)

Summer heat
Can we freeze?
Let's get lost for days
Summer heat
Can we freeze?
We're wild and free

Feel feel feel feel the heat heat heat
Summer heat
Can we freeze?
We're wild and free`,

'7':`LET'S DANCE DANCE DANCE
DANCE DANCE DANCE
DANCE DANCE DANCE
DANCE DANCE DANCE DANCE
Yeah it was so lit

LET'S DANCE DANCE DANCE
DANCE DANCE DANCE
DANCE DANCE DANCE
DANCE DANCE DANCE DANCE
눈치 볼 필요는 없어 어때?

No manners 이거 빼곤 다 돼
마음껏 shake it 두 배로 오늘 네 맘대로
Oh No matter what
비가 내리던 whatever
움직여 난리 난리 몸이

ABCD 상관없어
H 하고 OT 해 HOOT 달아올라
초대할게 네가 누구든지
Let's get the party started

LET'S DANCE DANCE DANCE DANCE
DANCE DANCE DANCE DANCE DANCE DANCE
DANCE DANCE DANCE
DANCE DANCE DANCE DANCE DANCE

뜨거워진 Oil에 물 붓듯이
Let's get the party started

LET'S DANCE DANCE DANCE
DANCE DANCE DANCE
DANCE DANCE DANCE
DANCE DANCE DANCE DANCE
Yeah it was so lit

LET'S DANCE DANCE DANCE
DANCE DANCE DANCE
DANCE DANCE DANCE
DANCE DANCE DANCE DANCE
눈치 볼 필요는 없어 어때?

지그재그 춤을 추는
새들 소리 Early in the morning
In the bedroom
허밍에 맞춰 내 머리에 떠올려 봐
Don't worry 미리 멀리
네가 그린 대로 말야
Turn 허리 Move it
이대로면 OK 뭘 하든지 맘에 들어

ABCD 상관없어
H 하고 OT 해 HOOT 달아올라
초대할게 네가 누구든지
Let's get the party started

LET'S DANCE DANCE DANCE DANCE
DANCE DANCE DANCE DANCE DANCE DANCE
DANCE DANCE DANCE
DANCE DANCE DANCE DANCE DANCE

뜨거워진 Oil에 물 붓듯이
Let's get the party started

LET'S DANCE DANCE DANCE
DANCE DANCE DANCE
DANCE DANCE DANCE
DANCE DANCE DANCE DANCE
Yeah it was so lit

LET'S DANCE DANCE DANCE
DANCE DANCE DANCE
DANCE DANCE DANCE
DANCE DANCE DANCE DANCE
눈치 볼 필요는 없어 어때?

You can DANCE all night
LET'S DANCE

ABBA Dancing Queen
내가 추는 춤을 따라 춰
초대할게 네가 누구든지
Let's get the party started

LET'S DANCE DANCE DANCE DANCE
DANCE DANCE DANCE DANCE DANCE DANCE
DANCE DANCE DANCE
DANCE DANCE DANCE DANCE DANCE

뜨거워진 Oil에 물 붓듯이
Let's get the party started`

  },
};

export default function ArtistPage() {
  const { artistId } = useParams();
  const navigate = useNavigate();
  const [openId, setOpenId] = useState(null);

  const artist = artistData[artistId];
  if (!artist) {
    return <p className="no-artist">존재하지 않는 아티스트입니다.</p>;
  }

  const selectedSong = artist.songs.find(s => s.id === openId);

  return (
    <div className="artist-page">
      <div className="artist-page-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <ArrowIcon />
        </button>
        <h1 className="artist-title">
          {artistId === 'juchang' ? '블로그 아카이빙 보기' : '대표곡'}
        </h1>
      </div>

      <ul className="song-list">
        {artist.songs.map(song => {
          const displayName =
            artistId === 'juchang' && song.id === '6'
              ? '서울여자대학교, Seoul Women\'s University (Official)'
              : artist.name;
          return (
            <li key={song.id} className="song-card">
              <button
                className="song-link"
                onClick={() => {
                  if (artistId === 'juchang') {
                    const url = juchangLinks[song.id];
                    if (url) window.open(url, '_blank');
                    else console.warn('No URL mapped for song', song.id);
                  } else {
                    setOpenId(song.id);
                  }
                }}
              >
                {artistId !== 'juchang' && song.imageUrl && (
                  <img
                    src={song.imageUrl}
                    alt={song.title}
                    className="song-img"
                  />
                )}
                <div
                  className="song-info"
                  style={{ marginLeft: artistId === 'juchang' ? 0 : '12px' }}
                >
                  <div className="song-name">{song.title}</div>
                  <div className="artist-page-name">{displayName}</div>
                </div>
                <div className="arrow-wrapper">
                  <ArrowIcon />
                </div>
              </button>
            </li>
          );
        })}
      </ul>

      {artistId !== 'juchang' && selectedSong && (
        <SongModal
          song={selectedSong}
          artistName={artist.name}
          lyrics={lyricsData[artistId][openId]}
          onClose={() => setOpenId(null)}
        />
      )}
    </div>
  );
}
