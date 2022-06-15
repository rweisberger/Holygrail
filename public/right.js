function Right(props){
    return (<>
        <aside>
            <PlusMinus section="right"  handle={props.handle}/>
            <div className="section">Right:{props.data.article}</div>
            <Data data={props.data}/>
        </aside>
        </>);
}