

class MyResponse{

    public static Success =  () => {
        const template:object = {
            "message": "Success",
            "data": []
        };
        return template;
    }

    public static Success_showData =  (result:any) => {
        const template:object = {
            "message": "Success",
            "data": result
        };
        return template;
    }

    public static internal_error =  (message:string,data:string) => {
        const template:object = {
            "message": "Failed",
            "error_key": "error_internal_server",
            "error_message": message,
            "error_data": data
        };
        return template;
    }

    public static error_param =  (result:any) => {
        // console.log(result["errors"][0]["message"]);
        
        const template:object = {
            "message": "Failed",
            "error_key": "error_param",
            "error_message": result["errors"][0]["message"],
            "error_data": result["errors"][0]["path"]
        };
        return template;
    }
}

export default MyResponse;

