import { Server } from "https://code4sabae.github.io/js/Server.js"

let port = 8881;

class MyServer extends Server {
    api(path, req) {
        console.log(path); //要求されたpathをコンソールに表示
        //index.htmlからのデータ受け取り&JSONへの保存
        if (path === "/api/data") {
            try{
                //ここでdata.jsonを読み込むが、無い場合に例外処理としてファイルの初期生成
                var json = JSON.parse(Deno.readTextFileSync("./data.json"));
                //fix: for文でデータ参照した時、同じユーザーがいた場合true
                var fix = false;
                //for文でデータ参照、同ユーザー検索
                for(let i = 0; json.length > i; i++){
                    //req.id(ブラウザから受信したidと、data.json内のユーザーのidが一致した場合)
                    if(req.id === json[i].id){
                        console.log("同ユーザーがいます。目標回数の更新");
                        //そのユーザーの目標回数を最新の物にする、fixをtrueにする
                        json[i].num = req.num;
                        fix = true;
                    }
                }
                //fixがtrueでない(同ユーザー非検出の)場合
                if(fix != true){
                    console.log("新しいユーザーの登録");
                    //data.jsonの配列の末尾にreqデータ(json形式)を挿入
                    json[json.length] = req;
                }
                //data.jsonのファイルを書きだして更新 <- 書き出さないと内部変数が変更されているだけで、ファイルは変わらない!!
                Deno.writeTextFileSync("data.json", JSON.stringify(json, null, "\t"));
                //fixをfalseに初期化
                fix = false;
            }
            //ファイルが無かった場合の例外処理
            catch(e){
                console.log("ファイルが見つかりませんでした")
                //data.jsonの作成
                Deno.writeTextFileSync("data.json", JSON.stringify([req], null, "\t"));
            }
            return null;
        }
        //result.html -> Server
        else if(path === "/api/result") {
            //json読み込み
            const json = JSON.parse(Deno.readTextFileSync("./data.json"));
            //while用のindexの初期化
            let i = 0;
            while (json.length > i) {
                //data.json内で一致するユーザーデータを検出
                if(req.id === json[i].id){
                    //目標達成が初めての場合cutを追加し、1を代入
                    if(json[i].cnt === undefined){
                        console.log("！初目標達成！");
                        json[i].cnt = 1;
                    }
                    //そうでなければcntの値を+1して再代入
                    else{
                        json[i].cnt = ++json[i].cnt;
                    }
                    break;
                }
                i++;
            }
            //data.jsonの更新
            Deno.writeTextFileSync("data.json", JSON.stringify(json, null, "\t"));
            return json[i].cnt;
        }
        //ratioのJSON取り込み
        else if (path === "/api/ratio") {
            //json読み込み
            const json = JSON.parse(Deno.readTextFileSync("./data.json"));
            //while用のindexの初期化
            let i = 0;
            while (json.length > i) {
                //data.json内で一致するユーザーデータを検出
                if(req.id === json[i].id){
                    //ratioが無い場合にレートを追加(初期値0)
                    if(json[i].ratio === undefined) {
                        console.log("！初期レート！");
                        json[i].ratio = req.kal;
                    }
                    //そうでなければratioの値を加算して再代入
                    else {
                        console.log("レート更新");
                        json[i].ratio += req.kal;
                    }
                    break;
                }
                i++;
            }
            //data.jsonの更新
            Deno.writeTextFileSync("data.json", JSON.stringify(json, null, "\t"));
            return json[i].ratio;
        }
        //index.thml(ranking) -> Server
        else if (path === "/api/ranking") {
            //json読み込み
            const json = JSON.parse(Deno.readTextFileSync("./data.json"));

            //比較関数
            function compare( a, b ) {
                var r = 0;
                if( a.ratio < b.ratio ) {
                    r = -1;
                }
                else if( a.ratio > b.ratio ) {
                    r = 1;
                }
                return ( -1 * r );
            }
            //比較関数によって大きい順にソート & 書き出し
            json.sort(compare);
            Deno.writeTextFileSync("data.json", JSON.stringify(json, null, "\t"));

            return json;
        }
        else if (path === "/api/user") {
            try{
                //ここでuser.jsonを読み込むが、無い場合に例外処理としてファイルの初期生成
                var json = JSON.parse(Deno.readTextFileSync("./user.json"));
                //fix: for文でデータ参照した時、同じユーザーがいた場合true
                var fix = false;
                //for文でデータ参照、同ユーザー検索
                for(let i = 0; json.length > i; i++){
                    //req.id(ブラウザから受信したidと、data.json内のユーザーのidが一致した場合)
                    if(req.id === json[i].id){
                        console.log("同ユーザーがいます。プロフィールの更新");
                        //そのユーザーの目標回数を最新の物にする、fixをtrueにする
                        json[i].ftm = req.ftm;
                        json[i].age = req.age;
                        json[i].wt = req.wt;
                        fix = true;
                    }
                }
                //fixがtrueでない(同ユーザー非検出の)場合
                if(fix != true){
                    console.log("新しいユーザーの登録");
                    //data.jsonの配列の末尾にreqデータ(json形式)を挿入
                    json[json.length] = req;
                }
                //data.jsonのファイルを書きだして更新 <- 書き出さないと内部変数が変更されているだけで、ファイルは変わらない!!
                Deno.writeTextFileSync("user.json", JSON.stringify(json, null, "\t"));
                //fixをfalseに初期化
                fix = false;
            }
            //ファイルが無かった場合の例外処理
            catch(e){
                console.log("ファイルが見つかりませんでした")
                //data.jsonの作成
                Deno.writeTextFileSync("user.json", JSON.stringify([req], null, "\t"));
            }
            return null;
        }
        //ranking.html -> server　(友達追加)
        else if (path === "/api/addfriend") {
            //json読み込み
            const json = JSON.parse(Deno.readTextFileSync("./data.json"));
            //while用のindexの初期化
            let i = 0;
            while (json.length > i) {
                //data.json内で一致するユーザーデータを検出
                if(req.id === json[i].id){
                    console.log(req.id, req.other);
                    //friendsの項目が存在しなかった場合
                    if(json[i].friends === undefined) {
                        json[i].friends = [req.other];
                    }
                    else {
                        //[frendsdsの大きさ]番目にフレンド追加
                        json[i].friends[json[i].friends.length] = req.other;
                        //重複は削除
                        json[i].friends = Array.from(new Set(json[i].friends));
                    }
                    
                    break;
                }
                i++;
            }
            //data.jsonの更新
            Deno.writeTextFileSync("data.json", JSON.stringify(json, null, "\t"));
            return null;
        }
        //reqで指定した人のインデックス番号を返す
        else if (path === "/api/getfriend") {
            //json読み込み
            const json = JSON.parse(Deno.readTextFileSync("./data.json"));
            //while用のindexの初期化
            let i = 0;
            while (json.length > i) {
                if(req.id === json[i].id) {
                    if (json[i].friends != undefined) {
                        return json[i].friends;
                    }
                    break;
                }
                i++;
            }
        }

        return null;
    }
};

new MyServer(port);