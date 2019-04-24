var app = new Vue({
    el: "#app",
    data() {
        return {
            post: {
                title: '',
                message: '',
                images: null
            },
            reply: {
                id: 0,
                pos: -1,
                str: ''
            }
        }
    },
    methods: {
        commitPost: function(){
            let url = 'http://localhost:3000/commit';
            this.$http.post(url, this.post, {emulateJSON:true}).then(function(res){
                console.log(res)
            }, function(res){
                console.log(res)
            })
        },
        replyFun: function(){
            let url = 'http://localhost:3000/review';
            this.$http.post(url, this.reply, {emulateJSON:true}).then(function(res){
                console.log(res)
            }, function(res){
                console.log(res)
            })
        },
        upload: function(){
            var upload = document.getElementById('upload');
            var file = upload.files[0];
            var formDate = new FormData();
            formDate.append('file', file)
            let url = 'http://localhost:3000/image';
            this.$http.post(url, formDate, {emulateJSON:true}).then(function(res){
                console.log(res)
            }, function(res){
                console.log(res)
            })
        }
    }
});