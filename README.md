# SWU-FESTIVAL
서울여자대학교 멋쟁이사자처럼 13기 운영진 축제 프로젝트 Front-end 레포지토리
<br>

## Git Branch Strategy
FESTIVAL 프로젝트는 GitHub Flow를 기반으로 한 브랜치 전략을 사용합니다.
- `main`: 배포 가능한 안정적인 코드를 관리하는 브랜치
- `develop`: 개발 중인 코드를 관리하는 default 브랜치
- `feature`: 새로운 기능 개발을 위한 브랜치
<br>

### 작업 순서
1. **Branch 생성**
   - develop 브랜치의 최신 상태 가져오기
      ```
      git fetch origin
      git pull origin develop
      ```
    - 새로운 feature 브랜치 생성 및 이동
      ```
      git checkout -b feature/{feature-name}
      ```
2. **Commit & Push**
    - 작은 단위로 나눠 commit
    - 아래의 Commit Message Convention을 준수
3. **Pull Request**
    - GitHub에서 PR 생성
      - develop ← feature/{feature-name}
    - 팀원들의 코드 리뷰와 피드백 진행
4. **Merge**
    - develop으로 merge
    - 작업 브랜치 삭제
5. **배포**
    - 개발이 완료된 코드는 main 브랜치로 merge하여 배포
<br>

## Branch Naming Convention
브랜치를 생성할 때는 다음과 같은 형식을 따릅니다.
```
feature/{feature-name}
```
#### 예시
feature/login  
<br>

## Commit Message Convention
작업한 내용을 커밋할 때는 다음과 같은 형식을 따릅니다.
```
type: Subject
```
### Type
| Type | 설명 |
|------|------|
| `Feat` | 새로운 기능 추가 |
| `Fix` | 버그 수정 |
| `Design` | UI/UX 디자인 변경 |
| `Style` | 코드 스타일 변경 (코드 포맷팅, 세미콜론 누락, 코드 변경이 없는 경우 등) |
| `Refactor` | 코드 리팩토링 |
| `Build` | 외부 라이브러리 추가, 빌드 설정 변경 |
| `Docs` | 문서 수정 (README.md 등) |
| `Test` | 테스트 코드 작성 |
| `Chore` | 그 외 자잘한 수정이나 빌드 업데이트 |
| `Init` | 프로젝트 초기 설정 |
<br>

## Tech Stack
- Frontend: React
- Backend:
