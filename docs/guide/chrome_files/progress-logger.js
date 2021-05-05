class ProgressLogger {
    userId;
    guideId;
    apiBaseUrl = 'https://iz6hpfbmyi.execute-api.ap-northeast-1.amazonaws.com/v1';
    scrollTargetElement;
    isRead = false;
    lastSendScrollRate = 0;
    currentScrollRate;
    init = async () => {
        this.userId = await this.getUserId();
        this.guideId = this.getGuideId();
        this.subscribeScroll();
    }
    async read() {
        if (!this.userId || !this.guideId) {
            console.log("[ProgressLogger#read] invalid parameter. user_id=" + this.userId + " guide_id=" + this.guideId);
        }
        const xhr = new XMLHttpRequest();
        xhr.open('POST', this.apiBaseUrl + '/reads', true);
        xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
        const request = "user_id=" + this.userId + "&guide_id=" + this.guideId;
        xhr.send(request);
    }
    async scrollInfo() {
        if (!this.userId || !this.guideId) {
            console.log("[ProgressLogger#read] invalid parameter. user_id=" + this.userId + " guide_id=" + this.guideId);
        }
        const xhr = new XMLHttpRequest();
        xhr.open('POST', this.apiBaseUrl + '/progresses', true);
        xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');

        const value = this.lastSendScrollRate + '/' + this.scrollTargetElement.clientHeight + '/' + this.scrollTargetElement.scrollTop + '/' + this.scrollTargetElement.scrollHeight;
        const request = "user_id=" + this.userId + "&guide_id=" + this.guideId + "&label=scrollinfo&value=" + value;
        xhr.send(request);
    }
    async getUserId() {
        return new Promise((resolve) => {
            const cookies = this.getCookies();
            const zaneUserId = cookies['zane_user_id'];
            if (zaneUserId) {
                resolve(zaneUserId);
            } else {
                const xhr = new XMLHttpRequest();
                xhr.open('GET', 'https://api.nnn.ed.nico/v1/users', true);
                xhr.withCredentials = true;
                xhr.onload = function (e) {
                    if (xhr.readyState === 4) {
                        if (xhr.status === 200) {
                            const user = JSON.parse(xhr.responseText);
                            const userId = user.zane_user_id;
                            resolve(userId);
                        }
                    }
                };
                xhr.send(null);
            }
        });
    }
    getGuideId() {
        const url = location.href;
        const matches = url.match(/guides\/([0-9]+)/);
        if(!matches || matches.length  <= 1) {
            return false;
        }
        return parseInt(matches[1]);
    }
    getCookies() {
        const arr = new Array();
        if(document.cookie != '') {
            const tmp = document.cookie.split('; ');
            for(let i=0; i<tmp.length; i++){
                const data = tmp[i].split('=');
                arr[data[0]] = decodeURIComponent(data[1]);
            }
        }
        return arr;
    }

    subscribeScroll() {
        this.scrollTargetElement = this.detectScrollTargetElement();
        this.currentScrollRate = this.calculateScrollRate();
        this.scrollTargetElement.onscroll = () => {
            this.currentScrollRate = this.calculateScrollRate();
        }
        setInterval(() =>{
            if (this.currentScrollRate > this.lastSendScrollRate) {
                this.lastSendScrollRate = this.currentScrollRate;
                (async () => {
                    if (this.isRead === false) {
                        await this.read();
                        this.isRead = true;
                    }
                    const xhr = new XMLHttpRequest();
                    xhr.open('POST', this.apiBaseUrl + '/scrolls', true);
                    xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
                    const request = "user_id=" + this.userId + "&guide_id=" + this.guideId + "&rate=" +  this.lastSendScrollRate;
                    xhr.send(request);
                })();
            }
        }, 5000);
    }

    calculateScrollRate() {
        return parseInt((this.scrollTargetElement.clientHeight + this.scrollTargetElement.scrollTop) * 100 / this.scrollTargetElement.scrollHeight);
    }

    detectScrollTargetElement() {
        const targetElement = window.parent.window.document.getElementById('container');
        if (targetElement) {
            return targetElement;
        }
        return document;
    }
}
window.addEventListener('load',  () => {
    const progressLogger = new ProgressLogger();
    (async () => {
        await progressLogger.init();
    })();
});