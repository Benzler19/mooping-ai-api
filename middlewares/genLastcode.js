const { GenerateLastCodeModel } = require('../routes')

module.exports = {
    generateLastCodeby: async (db_name,tb_name,lastcode,code,connection,branch_code) => {
    const now = new Date() 
    const new_lastcode = `${lastcode}${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, "0")}${now.getDate().toString().padStart(2,"0")}`

    const res = await GenerateLastCodeModel.generateLastCodeby({
        db_name,
        tb_name,
        lastcode: branch_code ? branch_code+'-'+new_lastcode : new_lastcode,
        code,
        digit:'4' 
    },connection)
    if (res.require === false) {
        ({ title: "ข้อผิดพลาด !", text: 'ไม่สามารถโหลดข้อมูล',})
        } else    
        return res.data
    }
}
