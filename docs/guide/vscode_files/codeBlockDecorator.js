/**
 * コードブロックに行番号やファイル名を追加するための関数です
 * 行番号を表示したいときは、lnum に先頭の行番号-1を指定します（8を指定すれば9から表示）
 * ファイル名を表示したいときは fname に指定します
 * 機能自体の使用方法はEXAMPLE.mdにあります
*/
function codeBlockDecorator() {
  const targets = document.getElementsByClassName("code-decorate");
  let toggeled = false;
  function switchToMultiNumbers(codeTag) {
    // 行番号を 2 列用の CSS クラスへ切り替える
    if (toggeled) return;
    codeTag.classList.add("multi-numbers");
  }

  Array.prototype.forEach.call(targets, (target) => {
    // 行番号追加
    const isDiff = Boolean(target.querySelector('.language-diff')); //diffかどうかを格納
    let lnum = target.getAttribute("lnum") === null ? null : Number(target.getAttribute("lnum")); // lnumが未指定だったらnull、指定されていたらその数値をlnumに格納
    if (lnum !== null) {
      const codeTag = target.getElementsByTagName("code")[0];
      codeTag.classList.add("with-lnum"); // for css
      const lines = codeTag.innerHTML.split(/\n/);
      lines.pop();
      const lineNumbers = document.createElement("div");
      lineNumbers.setAttribute("class", "line-numbers");
      const fragment = document.createDocumentFragment();

      let insertedCnt = lnum;
      let deletedCnt = lnum;
      for (let i = 0; i < lines.length; i++) {
        const element = document.createElement("div");
        element.innerHTML = lines[i];

        // コードブロックがdiffなら、行頭でinsertedかdeletedかを検知して行番号を別々に付与
        let token = null; //行頭が+か-かを格納。デフォルト値としてnull
        if(isDiff){
          const lineHead = element.innerText[0]; //+か-を取得
          if(lineHead === '+'){
            token = 'plus';
          }else if(lineHead === '-'){
            token = 'minus';
          }
        }

        const emptySpan = document.createElement("span");
        if (token === 'minus') {
          switchToMultiNumbers(codeTag);
          emptySpan.dataset.num = ++deletedCnt;
          emptySpan.setAttribute("class", "left");
        } else if (token === 'plus') {
          emptySpan.dataset.num = ++insertedCnt;
        } else {
          if (++deletedCnt !== ++insertedCnt) {
            switchToMultiNumbers(codeTag);
            extraSpan = document.createElement("span");
            extraSpan.setAttribute("class", "deleted-number");
            extraSpan.dataset.num = deletedCnt;
            emptySpan.appendChild(extraSpan);
          }
          emptySpan.dataset.num = insertedCnt;
        }
        fragment.appendChild(emptySpan);
      }
      lineNumbers.appendChild(fragment);

      codeTag.appendChild(lineNumbers);
    }

    //ファイル名追加
    const fname = target.getAttribute("fname");
    if (fname !== null) {
      const nameTag = document.createElement("span");
      nameTag.setAttribute("class", "name-tag");
      nameTag.innerHTML = fname;
      target.getElementsByTagName("pre")[0].appendChild(nameTag);
      target.getElementsByTagName("code")[0].classList.add("with-fname");
    }
  });
}
