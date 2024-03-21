import Card1 from "../../layout/Card";
import { FaTrashAlt } from "react-icons/fa";
import React, {useEffect} from "react";
import { Link } from "react-router-dom";

function RoomTypesGrid(props) {
    useEffect(() => {

    }, [props.rooms]);
    return (
        <Card1 className={"pt-4 pb-2"}>
              {props.rooms.length === 0 &&
                     <div>No room types added.</div>       }

            <div>
                <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                    <thead>
                        <tr>
                            <th style={{ padding: '8px', textAlign: 'left' }}>Room Type</th>
                            <th style={{ padding: '8px', textAlign: 'center' }}>Sqft</th>
                            <th style={{ padding: '8px', textAlign: 'center'  }}>Rooms Count</th>
                            <th style={{ padding: '8px', textAlign: 'center'  }}>Price (EVR)</th>
                            <th style={{ padding: '8px', textAlign: 'center'  }}>Single Bed Count</th>
                            <th style={{ padding: '8px', textAlign: 'center'  }}>Double Bed Count</th>
                            <th style={{ padding: '8px', textAlign: 'center'  }}>Triple Bed Count</th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.rooms.map(roomType => (
                            <tr key={roomType.Id}>
                                <td style={{ padding: '8px', textAlign: 'left'  }}><Link to={`/roomType/${roomType.Id}`}>{roomType.Code}</Link></td>
                                <td style={{ padding: '8px', textAlign: 'center'  }}>{roomType.Sqft}</td>
                                <td style={{ padding: '8px', textAlign: 'center'  }}>{roomType.RoomsCount}</td>
                                <td style={{ padding: '8px', textAlign: 'center'  }}>{Number(parseFloat(roomType.Price).toFixed(6))} </td>
                                <td style={{ padding: '8px', textAlign: 'center' }}>{roomType.SingleBedCount}</td>
                                <td style={{ padding: '8px', textAlign: 'center' }}>{roomType.DoubleBedCount}</td>
                                <td style={{ padding: '8px', textAlign: 'center' }}>{roomType.TripleBedCount}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>


        </Card1>

    );
}

export default RoomTypesGrid;