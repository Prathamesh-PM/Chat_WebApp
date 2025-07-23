package com.prathamesh.chat.chat_app.controllers;

import com.prathamesh.chat.chat_app.entities.Message;
import com.prathamesh.chat.chat_app.entities.Room;
import com.prathamesh.chat.chat_app.repositories.RoomRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/rooms")
@CrossOrigin("http://localhost:5173")
public class RoomController {

    private RoomRepository roomRepository;

    public RoomController(RoomRepository roomRepository){
        this.roomRepository = roomRepository;
    }

    // Create room
    @PostMapping
    public ResponseEntity<?> createRoom(@RequestBody String roomId){

        if (roomRepository.findByRoomId(roomId) != null){
            // Room Exist
            return ResponseEntity.badRequest().body("Room already exists!");
        }

        // Create new room
        Room room = new Room();
        room.setRoomId(roomId);
        Room saveRoom = roomRepository.save(room);
        return ResponseEntity.status(HttpStatus.CREATED).body(room);
    }



    // Get room : join
    @GetMapping("/{roomId}")
    public ResponseEntity<?> joinRoom(@PathVariable String roomId){

        Room room = roomRepository.findByRoomId(roomId);

        if (room == null){
            return ResponseEntity.badRequest().body("Room not found");
        }

        return ResponseEntity.ok(room);
    }



    // Get message of room
    @GetMapping("/{roomId}/messages")
    public ResponseEntity<List<Message>> getMessage(@PathVariable String roomId,
                                                    @RequestParam(value = "page", defaultValue = "0", required = false) int page,
                                                    @RequestParam(value = "size", defaultValue = "20", required = false) int size
                                                    ){

        Room room = roomRepository.findByRoomId(roomId);
        if (room == null)
            return ResponseEntity.badRequest().build();


        // Get messages
        // pagination
        List<Message> messages = room.getMessages();

        int start = Math.max(0,messages.size()-(page+1)*size);
        int end = Math.min(messages.size(),start + size);

        List<Message> paginatedMessages = messages.subList(start, end);

        return ResponseEntity.ok(messages);
    }



}
