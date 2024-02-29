import Card1 from "../../layout/Card";
import { FaTrashAlt } from "react-icons/fa";
import React from "react";

function RoomDetails(props) {

/*<div className={"col-2 title_4"}>
                            <button className={"delete_button"} onClick={props.onOpenDeleteRoomModal.bind(this, room)}>
                                <span>
                                <FaTrashAlt size={22}/> <span className={"title_4"}>&nbsp;Delete</span>
                            </span>
                            </button>
                        </div> */

    return (
        <Card1 className={"pt-4 pb-2"}>
              {props.rooms.length == 0 &&
                     <div>No room types added.</div>       }

            <div>
                <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                    <thead>
                        <tr>
                            <th style={{ padding: '8px', textAlign: 'center' }}>Code</th>
                            <th style={{ padding: '8px', textAlign: 'center' }}>Sqft</th>
                            <th style={{ padding: '8px' , textAlign: 'center' }}>Description</th>
                            <th style={{ padding: '8px', textAlign: 'center'  }}>Rooms Count</th>
                            <th style={{ padding: '8px', textAlign: 'center'  }}>Price</th>
                            <th style={{ padding: '8px', textAlign: 'center'  }}>Single Bed Count</th>
                            <th style={{ padding: '8px', textAlign: 'center'  }}>Double Bed Count</th>
                            <th style={{ padding: '8px', textAlign: 'center'  }}>Triple Bed Count</th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.rooms.map(roomType => (
                            <tr key={roomType.Id}>
                                <td style={{ padding: '8px', textAlign: 'center'  }}>{roomType.Code}</td>
                                <td style={{ padding: '8px', textAlign: 'center'  }}>{roomType.Sqft}</td>
                                <td style={{ padding: '8px', textAlign: 'center'  }}>{roomType.Description}</td>
                                <td style={{ padding: '8px', textAlign: 'center'  }}>{roomType.RoomsCount}</td>
                                <td style={{ padding: '8px', textAlign: 'center'  }}>{parseFloat(roomType.Price).toFixed(2)} &nbsp;$ </td>
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

export default RoomDetails;