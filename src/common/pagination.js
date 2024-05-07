module.exports=(page,limit,totalRow)=>{
    const totalPage=Math.ceil(totalRow/limit);
    let pages=[]
    const delta=2;
    const left=page-delta
    const right=page+delta

    for (let i=1; i<=totalPage; i++){
        if(
            i==1||i==totalPage||i==page|(i>=left)&&(i<=right)
        ){
            pages.push(i)
        }else if(i==(left-1)||i==(right+1)){
            pages.push("...")
        }
    }
    return pages

}