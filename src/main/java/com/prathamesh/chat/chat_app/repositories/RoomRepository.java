package com.prathamesh.chat.chat_app.repositories;

import com.prathamesh.chat.chat_app.entities.Room;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoomRepository extends MongoRepository<Room, String> {

    // Get room using room id
    Room findByRoomId(String roomId);

}
