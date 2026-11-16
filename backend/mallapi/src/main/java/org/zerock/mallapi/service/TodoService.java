package org.zerock.mallapi.service;

import org.zerock.mallapi.dto.TodoDTO;
import org.zerock.mallapi.dto.PageRequestDTO;
import org.zerock.mallapi.dto.PageResponseDTO;

public interface TodoService {

  Long register(TodoDTO todoDTO);

  TodoDTO get(Long tno);

  void modify(TodoDTO todoDTO);

  void remove(Long tno);

  PageResponseDTO<TodoDTO> list(PageRequestDTO pageRequestDTO);

}