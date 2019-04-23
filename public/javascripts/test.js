var app = new Vue({
    el: "#app",
    data() {
        return {
            post: {
                title: '',
                message: '',
                images: null
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
        }
    }
});