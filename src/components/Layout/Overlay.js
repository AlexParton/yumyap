const Overlay = props => {
    return (
        <div onClick={props.onTap} className={(props.status === 'on' ? 'overlay show' : 'overlay')}></div>
    );
}

export default Overlay;