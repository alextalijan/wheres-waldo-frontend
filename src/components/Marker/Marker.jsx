function Marker({ coordinates }) {
  const style = {
    position: 'absolute',
    width: '5%',
    left: `calc(${coordinates.x * 100}% - 2%)`,
    top: `calc(${coordinates.y * 100}% - 3%)`,
  };

  return <img src="/images/marker.png" style={style} />;
}

export default Marker;
